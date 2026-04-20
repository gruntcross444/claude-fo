import os
import json
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy import func
from sqlalchemy.orm import Session
from pydantic import BaseModel
import anthropic

from dependencies import get_db

router = APIRouter(prefix="/api/deals", tags=["deals"])

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "")


def require_admin(x_admin_token: str = Header("", alias="X-Admin-Token")):
    """Internal-only guard. Matches the X-Admin-Token pattern used in routers/admin.py."""
    if not ADMIN_SECRET or x_admin_token != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")


class DealCreate(BaseModel):
    buyer_name: str
    buyer_email: str
    property_name: str
    property_type: str
    deal_value: float
    source: str
    stage: str = "prospectando"
    notes: str = ""

SYSTEM_PROMPT = """You are Claude.FO Agent, an expert real estate sales analyst for Doral Service Realty. 
Your role is to analyze pipeline data and provide actionable recommendations to improve close rates and revenue.

You have access to live deal data and must:
1. Identify critical issues (stalled deals, weak channels, lost deals)
2. Provide recommendations with revenue impact
3. Suggest next steps with timeline
4. Be direct and action-oriented

Format recommendations as:
P1: [Action] — [Detail] = $[Revenue Impact]
P2: [Action] — [Detail] = $[Revenue Impact]

Always quantify impact. Never be generic."""

@router.post("", dependencies=[Depends(require_admin)])
async def create_deal(deal: DealCreate, db: Session = Depends(get_db)):
    """Create a new Doral deal. Internal-only."""
    from models import Deal
    new_deal = Deal(**deal.dict())
    db.add(new_deal)
    db.commit()
    db.refresh(new_deal)
    return {"id": new_deal.id, "status": "created"}

@router.get("/metrics", dependencies=[Depends(require_admin)])
async def get_pipeline_metrics(db: Session = Depends(get_db)):
    """Live pipeline metrics. Internal-only."""
    from models import Deal
    from database import ensure_db_connection
    
    ensure_db_connection()
    
    try:
        total = db.query(func.count(Deal.id)).scalar() or 0
        closed = db.query(func.count(Deal.id)).filter(Deal.conversion == 1).scalar() or 0
        close_rate = (closed / total * 100) if total > 0 else 0
        revenue = db.query(func.sum(Deal.deal_value)).filter(Deal.conversion == 1).scalar() or 0
        
        by_stage = db.query(
            Deal.stage,
            func.count(Deal.id).label('count'),
            func.avg(Deal.deal_value).label('avg_value')
        ).group_by(Deal.stage).all()
        
        by_source = db.query(
            Deal.source,
            func.count(Deal.id).label('count'),
            func.sum(Deal.conversion).label('conversions')
        ).group_by(Deal.source).all()
        
        avg_cycle = db.query(func.avg(Deal.days_to_close)).filter(Deal.conversion == 1).scalar()
        
        return {
            "total_deals": total,
            "closed_deals": closed,
            "close_rate": round(close_rate, 1),
            "total_revenue": float(revenue or 0),
            "avg_cycle_days": round(avg_cycle, 1) if avg_cycle else 0,
            "by_stage": [
                {"stage": s[0], "count": s[1], "avg_value": float(s[2] or 0)}
                for s in by_stage
            ],
            "by_source": [
                {
                    "source": s[0],
                    "leads": s[1],
                    "conversions": s[2] or 0,
                    "conversion_rate": round((s[2] / s[1] * 100) if s[1] > 0 else 0, 1)
                }
                for s in by_source
            ]
        }
    except Exception as e:
        print(f"Metrics error: {e}")
        return {
            "total_deals": 0,
            "closed_deals": 0,
            "close_rate": 0,
            "total_revenue": 0,
            "avg_cycle_days": 0,
            "by_stage": [],
            "by_source": [],
            "error": str(e)
        }

@router.post("/analyze", dependencies=[Depends(require_admin)])
async def run_pipeline_audit(db: Session = Depends(get_db)):
    """Claude-powered pipeline audit. Internal-only."""
    from models import Deal
    
    deals = db.query(Deal).all()
    if not deals:
        raise HTTPException(status_code=400, detail="No deals found")
    
    # Preparar data para análisis
    data = [
        {
            "fecha": d.created_at.isoformat(),
            "etapa": d.stage,
            "conversion": d.conversion,
            "ciclo_dias": d.days_to_close or 0,
            "valor_usd": float(d.deal_value),
            "origen": d.source,
            "propiedad": d.property_name
        } for d in deals
    ]
    
    total = len(data)
    conversiones = sum(1 for d in data if d["conversion"] == 1)
    close_rate = (conversiones / total * 100) if total > 0 else 0
    revenue = sum(d["valor_usd"] for d in data if d["conversion"] == 1)
    
    by_source = {}
    for d in data:
        if d["origen"] not in by_source:
            by_source[d["origen"]] = {"total": 0, "conversiones": 0, "revenue": 0}
        by_source[d["origen"]]["total"] += 1
        if d["conversion"] == 1:
            by_source[d["origen"]]["conversiones"] += 1
            by_source[d["origen"]]["revenue"] += d["valor_usd"]
    
    source_analysis = {}
    for orig, stats in by_source.items():
        conv_rate = (stats["conversiones"] / stats["total"] * 100) if stats["total"] > 0 else 0
        source_analysis[orig] = {
            "leads": stats["total"],
            "conversions": stats["conversiones"],
            "conversion_rate": round(conv_rate, 1),
            "revenue": round(stats["revenue"], 0)
        }
    
    # Call Claude API for intelligent recommendations (optional)
    ai_recommendations = None
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if api_key:
        try:
            stage_counts = {}
            for d in data:
                stage_counts[d["etapa"]] = stage_counts.get(d["etapa"], 0) + 1

            prompt = (
                "Pipeline snapshot for Doral Service Realty:\n\n"
                f"- Total deals: {total}\n"
                f"- Conversions: {conversiones}\n"
                f"- Close rate: {round(close_rate, 1)}%\n"
                f"- Revenue (closed): ${round(revenue, 0):,.0f}\n"
                f"- Deals by stage: {json.dumps(stage_counts)}\n"
                f"- Deals by source: {json.dumps(source_analysis)}\n\n"
                "Return the top 3 prioritized recommendations in this exact format:\n"
                "P1: [Action] — [Detail] = $[Revenue Impact]\n"
                "P2: [Action] — [Detail] = $[Revenue Impact]\n"
                "P3: [Action] — [Detail] = $[Revenue Impact]\n"
            )

            client = anthropic.Anthropic(api_key=api_key)
            message = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
            )
            ai_recommendations = message.content[0].text
        except Exception as e:
            ai_recommendations = f"Claude analysis skipped: {str(e)}"
    
    # Fallback: recomendaciones básicas si Claude falla
    recommendations = []
    
    prospectando = sum(1 for d in data if d["etapa"] == "prospectando")
    if prospectando > total * 0.25:
        recommendations.append({
            "priority": 1,
            "action": "Limpiar prospectando",
            "detail": f"{prospectando} leads sin calificar — implementar buyer heat score"
        })
    
    if source_analysis:
        worst_source = min(source_analysis.items(), key=lambda x: x[1]["conversion_rate"])
        best_rate = max(v["conversion_rate"] for v in source_analysis.values())
        if worst_source[1]["conversion_rate"] < 50:
            recommendations.append({
                "priority": 2,
                "action": f"Entrenar {worst_source[0]}",
                "detail": f"{worst_source[1]['conversion_rate']:.1f}% conversion — gap: {best_rate - worst_source[1]['conversion_rate']:.1f} pts"
            })
    
    return {
        "total_deals": total,
        "close_rate": round(close_rate, 1),
        "total_revenue": round(revenue, 0),
        "by_source": source_analysis,
        "recommendations": recommendations,
        "ai_analysis": ai_recommendations,
        "timestamp": datetime.now().isoformat()
    }

@router.put("/{deal_id}", dependencies=[Depends(require_admin)])
async def update_deal_stage(deal_id: int, new_stage: str, db: Session = Depends(get_db)):
    """Update deal stage. Internal-only."""
    from models import Deal
    
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    old_stage = deal.stage
    deal.stage = new_stage
    deal.updated_at = datetime.now()
    db.commit()
    
    return {"id": deal_id, "old_stage": old_stage, "new_stage": new_stage}

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from database import SessionLocal
import anthropic
import os
import json

router = APIRouter(prefix="/api/deals", tags=["deals"])

class DealCreate(BaseModel):
    buyer_name: str
    buyer_email: str
    property_name: str
    property_type: str
    deal_value: float
    source: str
    stage: str = "prospectando"
    notes: str = ""

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

@router.post("")
async def create_deal(deal: DealCreate, db: Session = Depends(get_db)):
    """Crear nuevo deal Doral"""
    from models import Deal
    new_deal = Deal(**deal.dict())
    db.add(new_deal)
    db.commit()
    db.refresh(new_deal)
    return {"id": new_deal.id, "status": "created"}

@router.get("/metrics")
async def get_pipeline_metrics(db: Session = Depends(get_db)):
    """Métricas pipeline en vivo"""
    from models import Deal
    
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

@router.post("/analyze")
async def run_pipeline_audit(db: Session = Depends(get_db)):
    """Audit con Claude API — recomendaciones inteligentes"""
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
    
    # Llamar a Claude API para análisis inteligente
    prompt = f"""Analiza este pipeline de ventas inmobiliarias:

DATOS:
- Total deals: {total}
- Cierre: {conversiones} ({close_rate:.1f}%)
- Revenue: ${revenue:,.0f}
- Ciclo promedio: {(sum(d['ciclo_dias'] for d in data if d['ciclo_dias'] > 0) / max(1, len([d for d in data if d['ciclo_dias'] > 0])))}d

POR ORIGEN:
{json.dumps(source_analysis, indent=2)}

TAREA:
1. Identifica 2-3 problemas críticos
2. Para cada uno: acción específica + impacto en $
3. Timeline realista (semana/mes)
4. Incluye puntos positivos (qué funciona bien)

Sé directo y cuantificable. Formato:
P1: [Acción] → [Detalle] = $[Impacto estimado]"""

    try:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        message = client.messages.create(
            model="claude-opus-4-20250805",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        ai_recommendations = message.content[0].text
    except Exception as e:
        ai_recommendations = f"Error calling Claude API: {str(e)}"
    
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

@router.put("/{deal_id}")
async def update_deal_stage(deal_id: int, new_stage: str, db: Session = Depends(get_db)):
    """Actualizar etapa + audit trail"""
    from models import Deal
    
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    old_stage = deal.stage
    deal.stage = new_stage
    deal.updated_at = datetime.now()
    db.commit()
    
    return {"id": deal_id, "old_stage": old_stage, "new_stage": new_stage}

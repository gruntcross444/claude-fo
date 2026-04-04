"""
CLAUDE.FO — Digital Product Generator
Generates all 8 missing PDF products with real, actionable content.
Run: python tools/generate_products.py
"""

import os
from fpdf import FPDF

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "downloads")


def _clean(text):
    """Replace Unicode characters that latin-1 cannot encode."""
    return (
        text.replace("\u2014", "-")   # em dash
            .replace("\u2013", "-")   # en dash
            .replace("\u2018", "'")   # left single quote
            .replace("\u2019", "'")   # right single quote
            .replace("\u201c", '"')   # left double quote
            .replace("\u201d", '"')   # right double quote
            .replace("\u2022", "-")   # bullet
            .replace("\u2026", "...")  # ellipsis
            .replace("\u00a0", " ")   # non-breaking space
    )


class ProductPDF(FPDF):
    def __init__(self, product_name):
        super().__init__()
        self.product_name = product_name
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "B", 8)
            self.set_text_color(150, 150, 150)
            self.cell(0, 6, "CLAUDE.FO  |  claudefo.com", align="L")
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 6, f"Page {self.page_no()}", align="C")

    def cover(self, title, subtitle, tagline):
        self.add_page()
        self.set_fill_color(15, 15, 15)
        self.rect(0, 0, 210, 297, "F")

        # Brand
        self.set_y(40)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, "CLAUDE.FO", align="C")
        self.ln(2)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, "claudefo.com", align="C")

        # Divider
        self.set_y(70)
        self.set_draw_color(60, 60, 60)
        self.set_line_width(0.5)
        self.line(30, self.get_y(), 180, self.get_y())

        # Title
        self.set_y(85)
        self.set_font("Helvetica", "B", 26)
        self.set_text_color(255, 255, 255)
        self.multi_cell(0, 12, _clean(title), align="C")
        self.ln(6)

        # Subtitle
        self.set_font("Helvetica", "", 13)
        self.set_text_color(180, 180, 180)
        self.multi_cell(0, 8, _clean(subtitle), align="C")
        self.ln(10)

        # Tagline box
        self.set_x(30)
        self.set_font("Helvetica", "I", 10)
        self.set_text_color(120, 120, 120)
        self.multi_cell(150, 6, _clean(tagline), align="C")

        # Bottom
        self.set_y(265)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, "Digital Product  |  claudefo.com  |  All rights reserved", align="C")

    def chapter(self, number, title):
        self.add_page()
        self.set_fill_color(240, 240, 240)
        self.rect(0, 0, 210, 32, "F")
        self.set_y(8)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, f"CHAPTER {number}", align="L")
        self.ln(5)
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(15, 15, 15)
        self.cell(0, 8, _clean(title), align="L")
        self.set_xy(self.l_margin, 38)
        self.set_text_color(30, 30, 30)

    def section_title(self, text):
        self.ln(6)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(15, 15, 15)
        self.multi_cell(0, 8, _clean(text))
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)

    def body(self, text):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, _clean(text))
        self.set_x(self.l_margin)
        self.ln(2)

    def bullet(self, items, bold_prefix=False):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        for item in items:
            item = _clean(item)
            self.set_x(25)
            if bold_prefix and ":" in item:
                parts = item.split(":", 1)
                self.set_font("Helvetica", "B", 10)
                self.cell(self.get_string_width(parts[0] + ": ") + 1, 6, parts[0] + ":")
                self.set_font("Helvetica", "", 10)
                self.multi_cell(0, 6, parts[1].strip())
            else:
                self.cell(5, 6, "-")
                self.multi_cell(0, 6, item)
        self.set_x(20)
        self.ln(2)

    def callout(self, text):
        self.ln(3)
        self.set_fill_color(240, 240, 240)
        self.set_draw_color(200, 200, 200)
        self.set_font("Helvetica", "I", 10)
        self.set_text_color(60, 60, 60)
        self.set_x(20)
        self.multi_cell(170, 7, _clean(f"  {text}  "), border=1, fill=True)
        self.ln(3)

    def numbered_list(self, items):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        for i, item in enumerate(items, 1):
            self.set_x(25)
            self.set_font("Helvetica", "B", 10)
            self.cell(8, 6, f"{i}.")
            self.set_font("Helvetica", "", 10)
            self.multi_cell(0, 6, _clean(item))
        self.set_x(20)
        self.ln(2)

    def save(self, filename):
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        path = os.path.join(OUTPUT_DIR, filename)
        self.output(path)
        print(f"  Created: {filename}")
        return path


# ─────────────────────────────────────────────
# 1. MONTHLY FINANCE TRACKER
# ─────────────────────────────────────────────
def create_finance_tracker():
    pdf = ProductPDF("Monthly Finance Tracker")
    pdf.cover(
        "Monthly Finance\nTracker",
        "A Complete System to Track, Manage\nand Grow Your Money Every Month",
        "Built for entrepreneurs, freelancers, and small business owners\nwho want clarity over their finances without the complexity.",
    )

    pdf.chapter(1, "Why Most People Fail at Tracking Finances")
    pdf.body(
        "Most people don't track their finances because the systems they try are either "
        "too complicated, too generic, or simply not built for how they actually earn and spend "
        "money. This guide gives you a lean, repeatable monthly system you can run in under "
        "30 minutes a week."
    )
    pdf.section_title("The 3 Core Mistakes")
    pdf.bullet([
        "Tracking without categorizing: Knowing you spent money is not the same as knowing where.",
        "Mixing personal and business: Separate accounts save you hours at tax time and give you accurate numbers.",
        "Reviewing too late: Monthly is the minimum. Weekly is the standard for growth-minded owners.",
    ], bold_prefix=True)
    pdf.callout("Rule #1: You cannot improve what you do not measure.")

    pdf.chapter(2, "Your Monthly Income Tracker")
    pdf.body("Every dollar that comes in gets logged here. Whether it's a client invoice, a product sale, or passive income — it all goes into one place.")
    pdf.section_title("Income Categories to Track")
    pdf.bullet([
        "Primary Business Revenue (services, products, retainers)",
        "Recurring / Subscription Revenue",
        "Affiliate or Partner Income",
        "Freelance or Side Projects",
        "Passive Income (digital products, royalties, rentals)",
        "Other (refunds, reimbursements)",
    ])
    pdf.section_title("Monthly Income Log Template")
    pdf.body("Date | Source | Category | Amount | Notes")
    pdf.body("Use this format in a spreadsheet or notebook. Date the entry when the money is received — not invoiced.")
    pdf.callout("Pro Tip: Set a recurring weekly 15-minute block to log income. Don't let it pile up.")

    pdf.chapter(3, "Your Monthly Expense Tracker")
    pdf.body("Expenses fall into two buckets: Fixed (same every month) and Variable (changes). Both need to be tracked, but you control them differently.")
    pdf.section_title("Fixed Expenses")
    pdf.bullet([
        "Rent / Office Space",
        "Software subscriptions (CRMs, tools, hosting)",
        "Insurance premiums",
        "Loan or lease payments",
        "Team salaries or retainers",
    ])
    pdf.section_title("Variable Expenses")
    pdf.bullet([
        "Advertising and paid media",
        "Contractor or freelance payments",
        "Supplies and materials",
        "Travel and transportation",
        "Meals and entertainment (business only)",
        "Education and training",
    ])
    pdf.section_title("Expense Log Template")
    pdf.body("Date | Vendor | Category | Amount | Fixed/Variable | Notes")
    pdf.callout("Review variable expenses first when cutting costs. Fixed costs require renegotiation — variable costs can be stopped immediately.")

    pdf.chapter(4, "Monthly Profit & Loss Summary")
    pdf.body("At the end of every month, complete this one-page summary. It takes 10 minutes and gives you the clearest picture of your business health.")
    pdf.section_title("The Formula")
    pdf.numbered_list([
        "Total Revenue: Add all income entries for the month.",
        "Total Expenses: Add all expense entries for the month.",
        "Gross Profit: Total Revenue minus Total Expenses.",
        "Profit Margin %: (Gross Profit / Total Revenue) x 100.",
        "Owner Pay: What you actually paid yourself this month.",
        "Net Position: Gross Profit minus Owner Pay.",
    ])
    pdf.callout("Target profit margin for a healthy service business: 30-50%. Product businesses: 20-40%.")
    pdf.section_title("Monthly Health Check Questions")
    pdf.bullet([
        "Did revenue grow compared to last month? Why or why not?",
        "Which expense grew most? Is it justified?",
        "What is my runway? (Cash / Monthly Expenses = Months of runway)",
        "Am I on track with my 90-day revenue goal?",
    ])

    pdf.chapter(5, "Cash Flow Forecasting")
    pdf.body("Cash flow is different from profit. You can be profitable on paper and still run out of cash. This section helps you look 30-90 days ahead.")
    pdf.section_title("Simple 90-Day Cash Flow Template")
    pdf.body("Month 1: Starting Cash + Expected Revenue - Expected Expenses = Ending Cash")
    pdf.body("Month 2: Month 1 Ending Cash + Expected Revenue - Expected Expenses = Ending Cash")
    pdf.body("Month 3: Month 2 Ending Cash + Expected Revenue - Expected Expenses = Ending Cash")
    pdf.body("Run this at the start of each month. Update it mid-month if anything changes significantly.")
    pdf.section_title("Warning Signs to Watch")
    pdf.bullet([
        "Cash balance dropping 3 months in a row",
        "Expenses growing faster than revenue",
        "Runway under 60 days with no new deals in pipeline",
        "Profit margin dropping below 20%",
    ])
    pdf.callout("If cash runway drops under 60 days: stop all non-essential expenses immediately and focus 100% on revenue.")

    pdf.chapter(6, "Annual Review & Goal Setting")
    pdf.body("Once a year, zoom out. Use your monthly data to set annual targets and identify the levers that matter most.")
    pdf.section_title("Annual Review Questions")
    pdf.bullet([
        "What was my best revenue month? What caused it?",
        "What was my worst month? What happened?",
        "What was my average monthly profit?",
        "Which product or service was most profitable?",
        "Which client or channel brought the most revenue?",
        "What expense could I eliminate next year?",
    ])
    pdf.section_title("Setting Next Year's Targets")
    pdf.numbered_list([
        "Set an annual revenue target (realistic stretch, not wishful).",
        "Break it into monthly minimums.",
        "Identify 2-3 revenue levers you will pull (new product, new channel, price increase).",
        "Set an expense ceiling: max % of revenue you will spend.",
        "Schedule quarterly finance reviews (not just monthly).",
    ])
    pdf.callout("A business with clear financial visibility grows faster because every decision is grounded in data.")

    pdf.save("Monthly-Finance-Tracker-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 2. SOCIAL MEDIA KIT
# ─────────────────────────────────────────────
def create_social_media_kit():
    pdf = ProductPDF("Social Media Kit")
    pdf.cover(
        "Social Media Kit",
        "30 Caption Templates, Platform Strategies\nand Growth Tactics for Entrepreneurs",
        "Stop guessing what to post. Start showing up with purpose, consistency,\nand content that actually builds your brand and drives sales.",
    )

    pdf.chapter(1, "The Foundation: Your Brand Voice")
    pdf.body("Before you write a single caption, you need to know who you are on social media. Your brand voice is the personality behind every post.")
    pdf.section_title("Define Your Voice in 3 Words")
    pdf.body("Pick 3 adjectives that describe how you want to sound. Examples:")
    pdf.bullet(["Bold, Direct, Practical", "Warm, Educational, Inspiring", "Professional, Sharp, Results-Focused"])
    pdf.body("Write your 3 words here and test every post against them.")
    pdf.section_title("Your Content Pillars")
    pdf.body("Choose 3-4 content pillars — repeating themes that anchor your content calendar.")
    pdf.bullet([
        "Education: Teach something useful. Builds trust and authority.",
        "Inspiration: Stories, wins, transformations. Builds emotional connection.",
        "Promotion: Products, services, offers. Drives revenue.",
        "Behind the Scenes: Your process, your life, your story. Builds loyalty.",
    ], bold_prefix=True)
    pdf.callout("80% of content should provide value. 20% can be promotional. This ratio builds audiences that actually buy.")

    pdf.chapter(2, "30 Caption Templates")
    pdf.body("Copy, customize, and post. Each template is designed to drive engagement or action.")
    pdf.section_title("Education Captions (10 Templates)")
    pdf.numbered_list([
        "The #1 mistake [your audience] makes with [topic] — and how to fix it in [timeframe]:",
        "Nobody talks about this, but [contrarian truth about your industry].",
        "[Number] things I wish I knew before [starting/launching/building] [thing]:",
        "Here is exactly how I [achieved result] with [method]. Step by step:",
        "If you are [struggling with X], try this instead: [simple reframe or tip].",
        "The difference between [thing A] and [thing B]: [quick breakdown].",
        "Most people think [common belief]. The truth is [reality]. Here is why it matters:",
        "Quick checklist for [task or goal]. Save this. [List 5-7 items]",
        "Why [industry thing] does not work the way most people think:",
        "[Number]-second rule for [common situation your audience faces]:",
    ])
    pdf.section_title("Engagement Captions (10 Templates)")
    pdf.numbered_list([
        "Drop a [emoji] if you have ever [relatable situation].",
        "Hot take: [controversial but defensible opinion]. Agree or disagree?",
        "What is one thing you wish you knew before [starting your business/career/journey]?",
        "This or that: [Option A] vs [Option B]? Tell me in the comments.",
        "Be honest. Which one are you? [Type A] or [Type B]? [Describe both]",
        "What is the hardest part of [your audience's challenge]? I read every reply.",
        "I am curious: how long did it take you to [achieve milestone]?",
        "Tell me your [industry/niche] in one word. Go.",
        "What is one thing you stopped doing that changed everything for you?",
        "If you could go back and give yourself one piece of advice, what would it be?",
    ])
    pdf.section_title("Promotional Captions (10 Templates)")
    pdf.numbered_list([
        "[Product/service] is now available. Here is what you get: [3-bullet benefit list]. Link in bio.",
        "I built [product] because I kept seeing [problem]. If you deal with this too — this is for you.",
        "The last day to [get offer/price/bonus] is [date]. After that: [consequence]. Link in bio.",
        "What would it mean for your business if you could [main result your product delivers]?",
        "[Customer name] went from [before] to [after] using [product/service]. Here is their story:",
        "Under [price] to [get result]. Here is everything included: [list]. Link in bio.",
        "You asked, so I built it. [Product] is finally here. [1-sentence description]. Get it: link in bio.",
        "Not for everyone. [Product] is specifically for [specific person with specific problem].",
        "[Timeframe] ago I [launched/started/created] [thing]. Here is what happened since then:",
        "I do not run sales often. But this week only: [offer]. Here is why: [reason]. Link in bio.",
    ])

    pdf.chapter(3, "Platform Strategies")
    pdf.section_title("Instagram")
    pdf.bullet([
        "Best post times: Tuesday-Friday, 9am-11am and 6pm-8pm local time.",
        "Reels get 3x more reach than static posts. Lead with Reels for growth.",
        "Use 3-5 targeted hashtags, not 30 generic ones.",
        "Stories daily for connection. Feed posts 3-5x per week for reach.",
        "Always include a CTA: Save this, Share with someone, Link in bio.",
    ])
    pdf.section_title("TikTok")
    pdf.bullet([
        "Hook in the first 1-2 seconds. State the payoff immediately.",
        "Post 1-3x daily when building. Frequency matters more than production quality.",
        "Use trending sounds + your original message for algorithmic boost.",
        "Longer videos (60-90 seconds) perform well for educational content.",
        "Reply to comments with video — powerful for building community.",
    ])
    pdf.section_title("LinkedIn")
    pdf.bullet([
        "Personal profiles outperform company pages. Post as yourself.",
        "Lead with a strong first line — it shows before the 'see more' cut.",
        "Story + lesson format works best: what happened, what I learned.",
        "Post 3-5x per week. Comment on others' posts daily for visibility.",
        "No external links in the post body — put them in the first comment.",
    ])
    pdf.callout("Pick ONE platform as your primary. Go deep before going wide. Mastery on one platform beats mediocrity on five.")

    pdf.chapter(4, "Hashtag Strategy Guide")
    pdf.body("Hashtags are discovery tools, not magic growth levers. Use them strategically.")
    pdf.section_title("The 3-Tier Hashtag System")
    pdf.bullet([
        "Niche hashtags (10K-100K posts): Highest chance of being found. Use 2-3 of these.",
        "Mid-range hashtags (100K-500K posts): Good mix of reach and competition. Use 2-3.",
        "Broad hashtags (500K+ posts): Low discovery chance, but adds context. Use 1.",
    ], bold_prefix=True)
    pdf.body("Total: 5-7 hashtags per post maximum. Quality over quantity.")
    pdf.callout("Research competitors in your niche. What hashtags do their top-performing posts use? Start there.")

    pdf.chapter(5, "Posting Schedule Template")
    pdf.section_title("5-Days-a-Week Schedule")
    pdf.bullet([
        "Monday: Education post (tip, tutorial, checklist)",
        "Tuesday: Engagement post (question, poll, hot take)",
        "Wednesday: Behind the scenes or personal story",
        "Thursday: Promotional or case study post",
        "Friday: Inspirational or week-in-review content",
    ], bold_prefix=True)
    pdf.body("Batch-create on Sundays. Schedule with Buffer, Later, or Metricool. Review analytics every Friday.")
    pdf.callout("Consistency for 90 days beats viral for one day. Show up, deliver value, repeat.")

    pdf.save("Social-Media-Kit-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 3. WEBSITE TEMPLATES PACK
# ─────────────────────────────────────────────
def create_website_templates():
    pdf = ProductPDF("Website Templates Pack")
    pdf.cover(
        "Website Templates Pack",
        "Copy-Paste Frameworks for Landing Pages,\nAbout Pages, Services Pages & More",
        "You do not need to be a copywriter to have a website that converts.\nThese templates give you the structure — you fill in your story.",
    )

    pdf.chapter(1, "How to Use This Pack")
    pdf.body("Each template in this pack is a fill-in-the-blank framework. Replace the bracketed placeholders with your real content. The structure, flow, and persuasion logic is already built in.")
    pdf.section_title("The 5-Second Test")
    pdf.body("A visitor who lands on your page for 5 seconds should be able to answer:")
    pdf.numbered_list([
        "What is this?",
        "Who is it for?",
        "Why should I care?",
        "What do I do next?",
    ])
    pdf.body("If your current website fails this test, use these templates to fix it today.")

    pdf.chapter(2, "Hero Section Templates")
    pdf.body("The hero is the first thing visitors see. It must hook them in under 3 seconds or they leave.")
    pdf.section_title("Template A — Result-Focused")
    pdf.callout(
        "Headline: [Achieve specific result] in [timeframe] — without [common frustration].\n"
        "Subheadline: [One sentence describing who you help and how.]\n"
        "CTA Button: [Action verb] + [what they get] — e.g. 'Get Your Free Strategy' or 'Start Today'"
    )
    pdf.section_title("Template B — Problem-Agitation")
    pdf.callout(
        "Headline: Tired of [frustrating problem]?\n"
        "Subheadline: [Your name/brand] helps [audience] [achieve result] without [sacrifice/pain].\n"
        "CTA: [Get started / Book a call / Download free guide]"
    )
    pdf.section_title("Template C — Bold Statement")
    pdf.callout(
        "Headline: [Bold claim about what you do or what you believe].\n"
        "Subheadline: [One sentence about who benefits and the transformation.]\n"
        "CTA: [Action] + social proof line: 'Join [X] [type of people] who already [result].'"
    )

    pdf.chapter(3, "About Page Template")
    pdf.body("Your About page is not about you — it is about making the visitor feel understood. Lead with them, not with your resume.")
    pdf.section_title("The Story Structure")
    pdf.numbered_list([
        "Start with THEM: Describe the problem or situation your ideal customer faces. Make them feel seen.",
        "Enter YOU: Briefly explain who you are and why you care about this problem.",
        "The Turning Point: Share a moment that crystallized your mission (a result, failure, discovery).",
        "What You Do Now: Clear statement of how you help people and what outcomes they get.",
        "The Proof: 2-3 credibility markers (clients served, years of experience, results achieved).",
        "The CTA: What should they do next? One clear action.",
    ])
    pdf.callout(
        "Example: 'If you are a [type of person] trying to [goal] but stuck on [obstacle], you are in the right place. "
        "I have helped [X] people go from [before] to [after]. Here is how I can help you too.'"
    )

    pdf.chapter(4, "Services / Products Page Template")
    pdf.body("Each service or product listing should answer: What is it? Who is it for? What do they get? What happens next?")
    pdf.section_title("Service Card Template")
    pdf.callout(
        "Service Name: [Clear, outcome-focused name]\n"
        "Who It Is For: [Specific audience with specific problem]\n"
        "What You Get: [3-5 bullet points — tangible deliverables or outcomes]\n"
        "Investment: [Price or 'Starting at...']\n"
        "CTA: [Book a Call / Get Started / Apply Now]"
    )
    pdf.section_title("Product Listing Template")
    pdf.callout(
        "Product Name: [Name]\n"
        "What It Is: [One sentence — what it is and what problem it solves]\n"
        "What Is Inside: [Bullet list of what they receive]\n"
        "Who It Is Best For: [Describe the ideal buyer]\n"
        "Price: $[X]\n"
        "CTA: [Buy Now / Download Now / Get Instant Access]"
    )

    pdf.chapter(5, "FAQ Section Template")
    pdf.body("A strong FAQ section removes objections before they become reasons not to buy. Address the real hesitations your customers have.")
    pdf.section_title("Universal Questions to Include")
    pdf.bullet([
        "How does this work? (Process clarity)",
        "How long until I see results? (Expectation setting)",
        "Is this right for me? (Qualification filter)",
        "What if I am not satisfied? (Risk reduction)",
        "How is this different from [alternative]? (Competitive differentiation)",
        "What do I need to get started? (Barrier removal)",
    ])

    pdf.chapter(6, "CTA (Call-to-Action) Templates")
    pdf.body("Weak CTAs kill conversions. Every page needs exactly one primary CTA. Make it clear, specific, and low-friction.")
    pdf.section_title("High-Converting CTA Formulas")
    pdf.bullet([
        "Action + Outcome: 'Download Your Free Guide' — not just 'Download'.",
        "Action + Speed: 'Get Instant Access' — removes the fear of a long process.",
        "Action + Specificity: 'Book My Free 30-Minute Strategy Call' — specific beats generic.",
        "Risk Reversal CTA: 'Start Free — No Credit Card Required'.",
        "Urgency CTA: 'Claim Your Spot — Only [X] Left'.",
    ])
    pdf.callout("One page. One CTA. The more options you give, the fewer actions they take. This is called the paradox of choice.")

    pdf.save("Website-Templates-Pack-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 4. REAL ESTATE LANDING TEMPLATE
# ─────────────────────────────────────────────
def create_real_estate_template():
    pdf = ProductPDF("Real Estate Landing Template")
    pdf.cover(
        "Real Estate\nLanding Template",
        "Conversion-Optimized Page Structure for\nAgents, Developers & Property Investors",
        "The difference between a listing page and a lead-generating machine\nis structure, copy, and a clear next step. This guide gives you all three.",
    )

    pdf.chapter(1, "The Real Estate Lead Problem")
    pdf.body(
        "Most real estate websites are digital brochures — they display information but fail to capture leads. "
        "The goal of every landing page is one thing: get the visitor to take a specific action. "
        "Whether that is booking a tour, submitting an inquiry, or downloading a property guide — "
        "the page must be designed to lead them there."
    )
    pdf.section_title("The 4 Elements of a Converting Real Estate Page")
    pdf.bullet([
        "A clear, benefit-driven headline (not just the property address)",
        "Compelling visuals paired with concise, outcome-focused copy",
        "Social proof and credibility signals",
        "One clear, low-friction call to action",
    ])

    pdf.chapter(2, "Hero Section — Property Landing Page")
    pdf.section_title("Headline Templates")
    pdf.bullet([
        "Your Next Home in [Neighborhood] — Starting at $[X]",
        "Live in the Heart of [City/Area] — [X] Units Available",
        "[Bedrooms]-Bedroom Luxury in [Neighborhood] — Schedule a Private Tour",
        "Finally — Affordable Luxury in [Area]. [X] Homes Left.",
    ])
    pdf.section_title("Subheadline Templates")
    pdf.bullet([
        "Modern [X]-bed, [X]-bath homes with [key feature]. [Distance] from [major landmark].",
        "Fully renovated units with [top amenities]. Walking distance to [point of interest].",
        "Designed for [target buyer]. [Number] floor plans available. Move-in ready.",
    ])
    pdf.callout("Lead with lifestyle and outcome, not just square footage. 'Waking up 10 minutes from the beach' converts better than '1,200 sq ft, 2/2'.")

    pdf.chapter(3, "Property Features Copy Framework")
    pdf.body("Organize features into benefit-oriented groups. Buyers buy feelings — features are just the evidence.")
    pdf.section_title("The Feature-Benefit Bridge")
    pdf.bullet([
        "Feature: Floor-to-ceiling windows | Benefit: Natural light that makes every room feel larger.",
        "Feature: In-unit washer/dryer | Benefit: No more laundry trips — fully self-contained living.",
        "Feature: Rooftop pool | Benefit: Resort-style living without leaving home.",
        "Feature: Smart home technology | Benefit: Control your home from your phone — temperature, security, everything.",
        "Feature: 1 covered parking space | Benefit: Never search for parking again.",
    ], bold_prefix=True)
    pdf.body("Formula: [Feature] means you can [specific benefit they experience]. Apply this to every feature on your page.")

    pdf.chapter(4, "Lead Capture Form Strategy")
    pdf.body("Your form is where most real estate pages lose leads. Long forms kill conversions. Short forms capture more leads, even if slightly lower quality.")
    pdf.section_title("Minimum Viable Form (Highest Conversion)")
    pdf.bullet(["First Name", "Phone Number", "CTA Button: 'Schedule My Tour'"])
    pdf.section_title("Standard Qualification Form")
    pdf.bullet(["Full Name", "Email Address", "Phone Number", "Move-in Timeline (dropdown)", "CTA: 'Get Property Details'"])
    pdf.callout("Never ask for more than you need at this stage. You can collect additional info on the call or follow-up email.")
    pdf.section_title("CTA Button Copy Options")
    pdf.bullet([
        "Schedule My Private Tour",
        "Get Floor Plans & Pricing",
        "Reserve My Unit — No Commitment",
        "See Available Units Now",
    ])

    pdf.chapter(5, "Trust & Social Proof Elements")
    pdf.body("Real estate is a high-trust purchase. Your landing page must signal credibility before the visitor fills in any form.")
    pdf.section_title("Trust Signals to Include")
    pdf.bullet([
        "Number of families housed, units sold, or years in business",
        "Media mentions or awards (logos only — no lengthy text)",
        "Google or Zillow review rating with count",
        "2-3 short testimonials from previous buyers or renters",
        "Professional photography (low-quality photos kill trust instantly)",
        "Clear company name, license number, and contact information",
    ])
    pdf.section_title("Testimonial Template")
    pdf.callout(
        "'[Name] made the process completely stress-free. From touring to move-in, everything was handled professionally. "
        "We found our home in [timeframe].'\n— [First Name, Last Initial], [City]"
    )

    pdf.chapter(6, "Follow-Up Copy Sequence")
    pdf.body("The landing page captures the lead. The follow-up sequence converts them into a client.")
    pdf.section_title("Email 1 — Immediate Confirmation (Send within 5 minutes)")
    pdf.callout(
        "Subject: Your [Property Name] info is on its way!\n\n"
        "Hi [Name], thanks for your interest in [Property Name]. "
        "I am sending you the full floor plans and pricing guide right now. "
        "In the meantime, would [Day] or [Day] work for a quick 10-minute call?\n\n"
        "[Your Name]"
    )
    pdf.section_title("Email 2 — Day 2 Follow-Up")
    pdf.callout(
        "Subject: Quick question about [Property Name]\n\n"
        "Hi [Name], just checking in — did you get a chance to look at the floor plans? "
        "Happy to answer any questions or schedule a tour at a time that works for you. "
        "Units are filling up — what timeline are you working with?\n\n"
        "[Your Name]"
    )

    pdf.save("Real-Estate-Landing-Template-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 5. CONTENT CALENDAR PLANNER
# ─────────────────────────────────────────────
def create_content_calendar():
    pdf = ProductPDF("Content Calendar Planner")
    pdf.cover(
        "Content Calendar\nPlanner",
        "A 90-Day System to Plan, Create and Publish\nContent That Builds Your Brand and Generates Leads",
        "The brands that win are not more creative — they are more consistent.\nThis planner gives you the system to show up every single week.",
    )

    pdf.chapter(1, "Why Content Calendars Fail")
    pdf.body("Most content calendars die by week two. Not because the creator lacks ideas — but because the system was too rigid, the volume too high, and there was no strategy behind the schedule.")
    pdf.section_title("The 3 Reasons Creators Quit")
    pdf.bullet([
        "Too many platforms: Spreading thin across 5 channels with no mastery of any.",
        "Creating from scratch daily: No batching, no repurposing — exhausting and unsustainable.",
        "No connection to goals: Posting without knowing what result you are trying to achieve.",
    ], bold_prefix=True)
    pdf.callout("A content calendar is a tool, not a prison. Build it to serve your goals — not to impress people who will never see it.")

    pdf.chapter(2, "Setting Your 90-Day Content Goals")
    pdf.body("Before planning a single post, answer these questions. They define your strategy.")
    pdf.section_title("90-Day Goal Setting Framework")
    pdf.numbered_list([
        "Primary Platform: Which ONE platform will you focus on for the next 90 days?",
        "Growth Goal: What follower or reach milestone are you targeting?",
        "Revenue Goal: How much revenue should this content contribute to?",
        "Lead Goal: How many leads, inquiries, or email subscribers do you want?",
        "Content Goal: How many pieces of content will you publish per week?",
    ])
    pdf.body("Write specific numbers. 'Grow my audience' is not a goal. '500 new followers in 90 days' is a goal.")

    pdf.chapter(3, "Your Content Pillars & Topic Bank")
    pdf.body("Content pillars are the 3-4 themes you return to repeatedly. They train your audience on what you are about and make ideation 10x faster.")
    pdf.section_title("How to Choose Your Pillars")
    pdf.bullet([
        "Pillar 1 — Your Expertise: What you know best. Educational, how-to, tutorial content.",
        "Pillar 2 — Your Story: Your journey, behind the scenes, personal lessons learned.",
        "Pillar 3 — Your Community: Your audience's wins, questions, shared experiences.",
        "Pillar 4 — Your Offers: Products, services, results, testimonials.",
    ], bold_prefix=True)
    pdf.section_title("Topic Bank: 30 Ideas for Any Niche")
    pdf.numbered_list([
        "The biggest mistake [audience] makes with [topic]",
        "How I went from [before] to [after] in [timeframe]",
        "[Number] tools I use every day for [result]",
        "What nobody tells you about [industry/topic]",
        "A day in my life as a [your role]",
        "The one thing I would do differently if starting over",
        "My honest review of [tool/method/approach]",
        "[Myth] vs [Reality] in [your industry]",
        "How to [achieve result] in [timeframe] without [sacrifice]",
        "The [number]-step process I use to [achieve outcome]",
        "Why I stopped [common practice] and what I do instead",
        "Client spotlight: [Name] went from [X] to [Y]",
        "Behind the scenes of [project/launch/process]",
        "Answering the top [number] questions I get about [topic]",
        "My [monthly/weekly/daily] routine for [area of life/business]",
        "The resource/book/course that changed how I [do thing]",
        "[Topic] for beginners: Where to start in [year]",
        "What I learned from [failure or challenge]",
        "The [number] non-negotiables in my business",
        "[Industry trend]: My take on what it means for [audience]",
        "How to [do hard thing] when you have no time/money/experience",
        "Real talk: The hardest part of being a [your role]",
        "The exact email/script/template I use to [achieve result]",
        "How much I spent on [thing] and whether it was worth it",
        "Step-by-step: How to [complete specific task] from scratch",
        "[Number] signs you are ready for [next level]",
        "The difference between [thing A] and [thing B] explained simply",
        "What I would tell my [X years ago] self about [topic]",
        "The question I get asked most — answered fully",
        "My [year] plan: Goals, focus, and what I am building",
    ])

    pdf.chapter(4, "The 90-Day Content Calendar Template")
    pdf.body("Use this structure for each week. Fill it in every Sunday for the coming week.")
    pdf.section_title("Weekly Planning Template")
    pdf.bullet([
        "Monday: [Pillar] | [Topic] | [Format: post/reel/story]",
        "Tuesday: [Pillar] | [Topic] | [Format]",
        "Wednesday: [Pillar] | [Topic] | [Format]",
        "Thursday: [Pillar] | [Topic] | [Format]",
        "Friday: [Pillar] | [Topic] | [Format]",
        "Weekend: Optional — engagement, stories, or repurposed content",
    ])
    pdf.section_title("Batch Creation Schedule")
    pdf.bullet([
        "Sunday evening (1 hour): Plan the week. Choose topics, formats, platforms.",
        "Monday morning (2 hours): Write all captions for the week. Done.",
        "Monday afternoon (1 hour): Film or design any visuals needed.",
        "Schedule everything using Buffer, Later, or Metricool.",
        "Daily (10 minutes): Engage with comments and DMs.",
    ])
    pdf.callout("Batching is the single most powerful productivity shift for content creators. Create in bulk, publish consistently.")

    pdf.chapter(5, "Content Repurposing System")
    pdf.body("One idea should become multiple pieces of content across multiple formats. This is how you multiply output without multiplying effort.")
    pdf.section_title("The Repurposing Tree")
    pdf.bullet([
        "Long-form video (YouTube/TikTok) -> Cut into 3-5 short clips for Reels/Shorts",
        "Blog post -> 5 social media posts + 1 email newsletter",
        "Podcast episode -> Quote graphics + audiogram clips + LinkedIn post",
        "Instagram carousel -> Twitter/X thread + LinkedIn article",
        "Client story/testimonial -> Case study post + before/after Reel + email feature",
    ], bold_prefix=True)
    pdf.callout("One piece of well-researched content should fuel your calendar for a week. Stop creating new ideas daily — go deeper on fewer ideas.")

    pdf.save("Content-Calendar-Planner-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 6. LEAD FUNNEL BLUEPRINT
# ─────────────────────────────────────────────
def create_lead_funnel():
    pdf = ProductPDF("Lead Funnel Blueprint")
    pdf.cover(
        "Lead Funnel\nBlueprint",
        "Build a System That Attracts Leads,\nNurtures Trust, and Converts to Sales — On Autopilot",
        "Your best salesperson works 24/7, never complains, and costs a fraction of hiring.\nThat salesperson is your funnel. This blueprint shows you how to build it.",
    )

    pdf.chapter(1, "What a Lead Funnel Actually Is")
    pdf.body(
        "A lead funnel is the journey from stranger to paying customer. "
        "Most businesses lose people at every stage because there is no deliberate path — "
        "just a website and a hope. A real funnel is engineered. Every step has one job."
    )
    pdf.section_title("The 4 Stages of Every Funnel")
    pdf.bullet([
        "Awareness: They discover you exist (social media, SEO, referral, ads).",
        "Interest: They engage with your content and want to know more.",
        "Decision: They are considering buying — comparing, evaluating, hesitating.",
        "Action: They buy, book, or sign up.",
    ], bold_prefix=True)
    pdf.callout("Most businesses only work on Awareness and Action — and wonder why conversion is low. This blueprint builds all 4 stages.")

    pdf.chapter(2, "Lead Magnet Ideas")
    pdf.body("A lead magnet is the free thing you give in exchange for an email address. It must be valuable enough to trade personal contact info for.")
    pdf.section_title("10 Lead Magnet Formats That Work")
    pdf.numbered_list([
        "Checklist: '10-Point Checklist to [Achieve Result]' — fast to consume, high perceived value.",
        "Swipe File: Templates, scripts, or copy examples they can use immediately.",
        "Mini Guide: A focused PDF solving one specific problem in 5-10 pages.",
        "Email Course: 5-day email sequence teaching a skill or concept step by step.",
        "Free Tool / Calculator: Interactive resource that gives personalized output.",
        "Webinar / Workshop: Live or recorded training that positions you as an expert.",
        "Case Study: 'How [Client] Achieved [Result]' — proof-based lead magnet.",
        "Quiz / Assessment: 'What Type of [X] Are You?' — high engagement, personalized results.",
        "Free Consultation: 20-30 minutes of your expertise in exchange for their contact info.",
        "Resource Library: Collection of templates, tools, or guides in one place.",
    ])
    pdf.section_title("Choosing the Right Lead Magnet")
    pdf.bullet([
        "It must solve a real, immediate problem your ideal customer has RIGHT NOW.",
        "It must be consumable in under 15 minutes (except for courses and webinars).",
        "It must relate directly to what you sell — not a random topic.",
        "It must deliver a quick win that makes them want more from you.",
    ])

    pdf.chapter(3, "Landing Page Structure")
    pdf.body("Your lead magnet needs a dedicated landing page. A homepage does not convert leads — a focused page does.")
    pdf.section_title("The 6-Element Landing Page")
    pdf.numbered_list([
        "Headline: The specific result they get. 'Get the [Lead Magnet Name] — Free'.",
        "Subheadline: Who it is for and the core promise in one sentence.",
        "Visual: Mockup of the guide, screenshot, or relevant image.",
        "Bullet Benefits: 3-5 bullets of exactly what they will learn or get.",
        "Form: Name and email. Nothing more.",
        "CTA Button: 'Send Me the [Guide/Checklist/Template]' — specific beats generic.",
    ])
    pdf.callout("Remove navigation menus from your landing page. Every link is an exit. Keep them focused on one action.")

    pdf.chapter(4, "5-Part Email Nurture Sequence")
    pdf.body("After they opt in, your email sequence does the selling. This sequence converts leads to buyers over 5-7 days.")
    pdf.section_title("Email 1 — Immediate Delivery (Day 0)")
    pdf.callout("Subject: Your [Lead Magnet Name] is here!\nBody: Deliver the resource. Set expectations for what comes next. Keep it short.")
    pdf.section_title("Email 2 — The Story (Day 1)")
    pdf.callout("Subject: Why I almost gave up on [topic]...\nBody: Share a personal story about the problem they face. Build connection and relatability.")
    pdf.section_title("Email 3 — The Education (Day 2-3)")
    pdf.callout("Subject: The [method/framework] that changed everything\nBody: Teach something valuable. Position your product as the next logical step.")
    pdf.section_title("Email 4 — Social Proof (Day 4)")
    pdf.callout("Subject: How [Name] went from [before] to [after]\nBody: Share a client result or case study. Let results do the persuasion.")
    pdf.section_title("Email 5 — The Offer (Day 5-7)")
    pdf.callout("Subject: Ready to [achieve result]? Here is how I can help.\nBody: Make your offer. Be direct. State the benefit, the price, and what to do next.")

    pdf.chapter(5, "Conversion Optimization Tactics")
    pdf.section_title("What to Test First")
    pdf.bullet([
        "Headline: Test 2 variations. The headline alone can move conversion by 30-50%.",
        "CTA Button Color: Contrasting colors outperform blended ones.",
        "Form Length: Shorter forms almost always convert better.",
        "Social Proof Placement: Move testimonials above the fold and test conversion rate.",
        "Lead Magnet Name: 'Free Guide' vs 'The [Specific] Blueprint' — specific names win.",
    ])
    pdf.section_title("Benchmarks to Track")
    pdf.bullet([
        "Landing page conversion rate: 25-40% is healthy. Under 15% = fix the headline first.",
        "Email open rate: 30-50% for a fresh list. Below 20% = test subject lines.",
        "Email click rate: 5-10% is solid. Below 2% = the offer or copy needs work.",
        "Sales conversion rate: 1-3% of email list buying is typical. Above 5% is excellent.",
    ])

    pdf.save("Lead-Funnel-Blueprint-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 7. EMAIL & SMS PLAYBOOK
# ─────────────────────────────────────────────
def create_email_sms_playbook():
    pdf = ProductPDF("Email & SMS Playbook")
    pdf.cover(
        "Email & SMS\nPlaybook",
        "Templates, Sequences, and Strategies for\nMarketing Channels That Convert at the Highest Rate",
        "Social media rents your audience. Email and SMS own it.\nThis playbook is your guide to channels you actually control.",
    )

    pdf.chapter(1, "Why Email & SMS Still Win")
    pdf.body(
        "With every algorithm change, social media reach drops. But email and SMS reach "
        "your audience directly — no algorithm, no pay-to-play. "
        "Email averages $42 return for every $1 spent. SMS open rates exceed 90%. "
        "No other channel comes close."
    )
    pdf.section_title("Email vs SMS — When to Use Each")
    pdf.bullet([
        "Email: Longer content, education, nurture sequences, detailed offers, newsletters.",
        "SMS: Time-sensitive offers, appointment reminders, flash sales, quick updates, re-engagement.",
    ], bold_prefix=True)
    pdf.callout("The most powerful brands use both. Email builds the relationship. SMS closes the loop.")

    pdf.chapter(2, "Welcome Email Sequence (5 Emails)")
    pdf.body("The first 7 days after someone joins your list are the most important. This sequence sets the tone for the entire relationship.")
    pdf.section_title("Email 1 — Welcome (Immediate)")
    pdf.callout(
        "Subject: Welcome! Here is what happens next.\n\n"
        "Hey [Name], welcome to [brand/community name]!\n\n"
        "I am [Your Name], and I help [audience] [achieve result].\n\n"
        "Here is what you can expect from me:\n"
        "- [Value promise 1]\n- [Value promise 2]\n- [Value promise 3]\n\n"
        "Reply to this email and tell me: what is the #1 challenge you are facing with [topic] right now?\n\n"
        "Talk soon, [Your Name]"
    )
    pdf.section_title("Email 2 — Your Story (Day 2)")
    pdf.callout(
        "Subject: The moment everything changed for me\n\n"
        "I want to tell you something I do not share often...\n"
        "[Share a personal story about facing the same challenge your audience faces. "
        "Be specific. Be vulnerable. Show the before and the turning point.]\n\n"
        "This is why I built [brand/product]. And it is why I am glad you are here.\n\n"
        "[Your Name]"
    )
    pdf.section_title("Email 3 — Value Drop (Day 3-4)")
    pdf.callout(
        "Subject: [Actionable tip or quick win — make it specific]\n\n"
        "Today I want to give you something you can use immediately.\n\n"
        "[Teach one concrete, actionable thing. Keep it focused. End with a transition "
        "toward your offer: 'If you want to go deeper on this, here is how I can help...']\n\n"
        "[Your Name]"
    )
    pdf.section_title("Email 4 — Social Proof (Day 5)")
    pdf.callout(
        "Subject: '[Client quote or result as subject line]'\n\n"
        "[Name] reached out to me [timeframe] ago. They were dealing with [specific problem].\n\n"
        "After [working together / using our product], here is what changed: [specific result].\n\n"
        "Their words: '[Direct quote from client or customer]'\n\n"
        "If you are in a similar place, here is what I recommend as a next step: [CTA]"
    )
    pdf.section_title("Email 5 — The Offer (Day 6-7)")
    pdf.callout(
        "Subject: Ready for [specific result]? Here is how.\n\n"
        "If you have been reading my emails this week, you know I care about [topic].\n\n"
        "I want to make it easy for you to take the next step.\n\n"
        "[Product/Service Name] is [one sentence description].\n\n"
        "It includes: [3 bullet benefits]\n\n"
        "Investment: $[X]\n\n"
        "[CTA button text]: [Link]\n\n"
        "Questions? Just reply to this email. I answer every one."
    )

    pdf.chapter(3, "Abandoned Cart Email Sequence (3 Emails)")
    pdf.section_title("Email 1 — Gentle Reminder (1 Hour After Abandonment)")
    pdf.callout(
        "Subject: Did something go wrong?\n\n"
        "Hey [Name], I noticed you did not complete your order for [Product Name].\n\n"
        "If anything went wrong — payment issue, question, or hesitation — "
        "I am here to help. Just reply to this email.\n\n"
        "Your cart is saved: [Link to cart]"
    )
    pdf.section_title("Email 2 — Value Reminder (24 Hours Later)")
    pdf.callout(
        "Subject: What you are getting with [Product Name]\n\n"
        "Quick reminder of what is waiting for you:\n"
        "[Bullet list of 3-5 benefits or what is included]\n\n"
        "Hundreds of people have used [Product Name] to [achieve specific result].\n\n"
        "Ready to continue? [Complete My Order — Link]"
    )
    pdf.section_title("Email 3 — Final Push (48-72 Hours Later)")
    pdf.callout(
        "Subject: Last reminder (I will not bother you again)\n\n"
        "This is my last email about your [Product Name] order.\n\n"
        "If you are on the fence, here is the simplest way to think about it:\n"
        "[Single compelling reason to buy — ROI, result, or risk reversal]\n\n"
        "[Complete My Order — Link]\n\n"
        "If this is not the right time, no worries. I will continue sending you value."
    )

    pdf.chapter(4, "20 SMS Templates")
    pdf.body("Keep SMS under 160 characters when possible. Be direct. Include the offer and one link.")
    pdf.section_title("Promotional SMS Templates")
    pdf.numbered_list([
        "[Brand]: [Product] is now live. Get it before [deadline]: [link]",
        "Flash sale — 24 hours only. [X]% off [product]. Use code [CODE]: [link]",
        "Last [X] spots available for [offer/event]. Grab yours: [link]",
        "Hey [Name]! New [product/post/resource] just dropped. Check it out: [link]",
        "[Brand]: Thank you for your order! Track it here: [link]",
    ])
    pdf.section_title("Engagement & Follow-Up SMS Templates")
    pdf.numbered_list([
        "Hey [Name], quick question — did you get a chance to check out [resource]?",
        "[Name], your consultation is in 1 hour. See you at [link/location].",
        "Reminder: [Event/offer] ends tonight at midnight. Do not miss it: [link]",
        "[Name], your order is ready for pickup / has shipped. Details: [link]",
        "We miss you! Come back and [action] — here is [incentive]: [link]",
    ])
    pdf.section_title("Re-Engagement SMS Templates")
    pdf.numbered_list([
        "Hey [Name], it has been a while. Here is something for you: [offer + link]",
        "[Brand]: We updated [product/service]. Here is what is new: [link]",
        "[Name], exclusive to our SMS list — [offer]: [link]. Expires [date].",
        "Still interested in [topic/product]? We have something new for you: [link]",
        "One thing I know about [Name]: [personalized compliment or insight]. Here is how to [next step]: [link]",
    ])

    pdf.chapter(5, "Subject Line Formulas That Drive Opens")
    pdf.body("40% of emails are opened or ignored based on the subject line alone. These formulas consistently outperform generic lines.")
    pdf.section_title("Top-Performing Formulas")
    pdf.bullet([
        "The Curiosity Gap: 'I almost did not send this...' / 'You will not believe what happened'",
        "The Direct Benefit: 'How to [achieve result] in [timeframe]'",
        "The Question: 'Is [common belief] killing your [goal]?'",
        "The Number: '[X] things I use every day to [result]'",
        "The Personal: '[Name], this is specifically for you'",
        "The Urgency: 'Closing in [X] hours — do not miss this'",
        "The Controversial: 'Why I stopped [popular practice] forever'",
        "The Story: 'The worst mistake I ever made in [area]'",
    ])
    pdf.callout("Test two subject lines every send. After 30 days, you will know exactly what your audience responds to.")

    pdf.save("Email-SMS-Playbook-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# 8. AUTOMATION STARTER KIT
# ─────────────────────────────────────────────
def create_automation_kit():
    pdf = ProductPDF("Automation Starter Kit")
    pdf.cover(
        "Automation\nStarter Kit",
        "The 10 Business Automations Every Entrepreneur\nNeeds — Plus the Tools and Workflows to Build Them",
        "Your time is your most valuable asset. Automation does not replace you —\nit frees you to do the work only you can do.",
    )

    pdf.chapter(1, "The Automation Mindset")
    pdf.body(
        "Most entrepreneurs automate too late, too little, or the wrong things. "
        "The goal is not to automate everything — it is to automate the repetitive, "
        "low-judgment tasks that eat your hours without growing your business. "
        "If you do something more than 3 times, it should be automated."
    )
    pdf.section_title("The 3-Question Automation Filter")
    pdf.bullet([
        "Is this task repetitive? Does it happen on a schedule or triggered by an event?",
        "Does it require human judgment, creativity, or relationship? If yes, keep it human.",
        "What would happen if it was done 10x faster with zero manual effort?",
    ])
    pdf.callout("Start with automations that save at least 2 hours per week. Those 2 hours compound into 100+ hours per year.")

    pdf.chapter(2, "Your Tool Stack")
    pdf.section_title("The Core Automation Stack (Budget-Friendly)")
    pdf.bullet([
        "Zapier or Make (formerly Integromat): Connect apps and automate workflows without code. Start free.",
        "Notion or Airtable: Database and project management. The hub for your systems.",
        "Calendly: Automate scheduling — no more back-and-forth emails.",
        "ConvertKit or Mailchimp: Email automation and sequences.",
        "Stripe: Payment collection, invoicing, and subscription management.",
        "Typeform or Tally: Smart forms and surveys that feed into your automation.",
        "Slack or Telegram: Receive automated alerts and updates.",
        "Google Sheets: Free, powerful database for lightweight automation data.",
    ], bold_prefix=True)
    pdf.callout("Do not buy tools you do not have a workflow for. Start with one automation, master it, then expand.")

    pdf.chapter(3, "10 Essential Business Automations")
    pdf.section_title("Automation 1 — New Lead Notification")
    pdf.body("When: Someone fills out your contact or lead form.")
    pdf.body("Automate: Send yourself a Slack/Telegram message with their details. Log to Google Sheets. Add to email list.")
    pdf.body("Tools: Typeform + Zapier + Slack + Google Sheets")

    pdf.section_title("Automation 2 — Welcome Email on Signup")
    pdf.body("When: Someone subscribes to your email list.")
    pdf.body("Automate: Trigger a welcome email sequence immediately. Tag them by source for segmentation.")
    pdf.body("Tools: ConvertKit or Mailchimp (built-in automation)")

    pdf.section_title("Automation 3 — Payment Confirmation & Delivery")
    pdf.body("When: Customer completes a purchase.")
    pdf.body("Automate: Send confirmation email with receipt and product access. Notify you via Slack. Log order to sheet.")
    pdf.body("Tools: Stripe + Zapier + Gmail or ConvertKit")

    pdf.section_title("Automation 4 — Appointment Scheduling & Reminders")
    pdf.body("When: Client books a call or meeting.")
    pdf.body("Automate: Confirm booking instantly. Send reminder 24 hours and 1 hour before. Add to your calendar.")
    pdf.body("Tools: Calendly (fully built-in, zero setup needed)")

    pdf.section_title("Automation 5 — Client Onboarding Sequence")
    pdf.body("When: New client signs or pays.")
    pdf.body("Automate: Send onboarding email with instructions, forms, and next steps. Create their project folder. Schedule kickoff.")
    pdf.body("Tools: Stripe + Zapier + Google Drive + ConvertKit")

    pdf.section_title("Automation 6 — Invoice & Payment Follow-Up")
    pdf.body("When: Invoice is created or goes unpaid after X days.")
    pdf.body("Automate: Send invoice automatically on a schedule. Follow up with a reminder email if unpaid after 3 and 7 days.")
    pdf.body("Tools: Stripe or QuickBooks + Zapier")

    pdf.section_title("Automation 7 — Social Media Scheduling")
    pdf.body("When: You create content in batches.")
    pdf.body("Automate: Schedule all posts for the week in one sitting. Auto-publish at optimal times.")
    pdf.body("Tools: Buffer, Later, or Metricool")

    pdf.section_title("Automation 8 — Review / Testimonial Request")
    pdf.body("When: Project is completed or X days after purchase.")
    pdf.body("Automate: Send an email asking for a Google review or testimonial with a direct link.")
    pdf.body("Tools: Zapier + Gmail / ConvertKit — trigger on Stripe payment + delay 7 days")

    pdf.section_title("Automation 9 — Re-engagement for Cold Leads")
    pdf.body("When: A lead has not opened your emails in 60+ days.")
    pdf.body("Automate: Trigger a re-engagement sequence (3 emails). If still no action, unsubscribe automatically to protect deliverability.")
    pdf.body("Tools: ConvertKit or Mailchimp (built-in segment automation)")

    pdf.section_title("Automation 10 — Weekly Business Report")
    pdf.body("When: Every Monday morning.")
    pdf.body("Automate: Pull data from Stripe (revenue), Google Analytics (traffic), and email platform (open rates). Compile into a summary sent to your email or Slack.")
    pdf.body("Tools: Zapier + Stripe + Google Analytics + Slack")

    pdf.chapter(4, "Step-by-Step: Building Your First Zapier Workflow")
    pdf.body("This walkthrough builds Automation 1 — the new lead notification — from scratch.")
    pdf.numbered_list([
        "Create a free account at zapier.com.",
        "Click 'Create Zap'.",
        "Trigger App: Choose your form tool (Typeform, Tally, Google Forms).",
        "Trigger Event: Choose 'New Entry' or 'New Response'.",
        "Connect your form account and select your specific form.",
        "Action App: Choose Slack (or Gmail for email notification).",
        "Action Event: Choose 'Send Channel Message' (Slack) or 'Send Email' (Gmail).",
        "Map the fields: Include name, email, and message from the form.",
        "Test the Zap with a sample submission.",
        "Turn the Zap on. Done.",
    ])
    pdf.callout("Your first Zap will take 20 minutes. Your tenth will take 5. The skill compounds quickly.")

    pdf.chapter(5, "Automation ROI Calculator")
    pdf.body("Before building an automation, calculate whether it is worth your time to build.")
    pdf.section_title("The Formula")
    pdf.body("Hours saved per week x Your hourly rate x 52 weeks = Annual value of automation")
    pdf.body("If the automation takes 4 hours to build and saves 3 hours per week at $50/hour:")
    pdf.body("3 hours x $50 x 52 = $7,800 in annual value from 4 hours of setup. That is a 1,950% return.")
    pdf.section_title("Priority Matrix")
    pdf.bullet([
        "High time savings + Easy to build: Do these FIRST.",
        "High time savings + Hard to build: Plan and hire help if needed.",
        "Low time savings + Easy to build: Do these when you have spare time.",
        "Low time savings + Hard to build: Skip these entirely.",
    ], bold_prefix=True)
    pdf.callout("Automate the work that repeats. Protect the work that requires you. That is the formula for a scalable business.")

    pdf.save("Automation-Starter-Kit-ClaudeFO.pdf")


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print(f"\nGenerating products to: {os.path.abspath(OUTPUT_DIR)}\n")
    create_finance_tracker()
    create_social_media_kit()
    create_website_templates()
    create_real_estate_template()
    create_content_calendar()
    create_lead_funnel()
    create_email_sms_playbook()
    create_automation_kit()
    print("\nAll 8 products generated successfully.")

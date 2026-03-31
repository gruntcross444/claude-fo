"""Generate PDF products from markdown files."""
import re
from fpdf import FPDF


def sanitize(text):
    """Replace unicode chars with ASCII equivalents for PDF compatibility."""
    return (text
        .replace('\u2014', '--').replace('\u2013', '-')
        .replace('\u2019', "'").replace('\u2018', "'")
        .replace('\u201c', '"').replace('\u201d', '"')
        .replace('\u2026', '...').replace('\u2022', '*')
        .replace('\u2192', '->').replace('\u00a0', ' ')
        .encode('latin-1', 'replace').decode('latin-1'))


class PromptPackPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, 'Claude.FO | Real Estate Prompt Pack', align='L')
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', '', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}  |  claude-fo.vercel.app', align='C')

    def add_cover(self):
        self.add_page()
        self.ln(60)
        self.set_font('Helvetica', 'B', 32)
        self.set_text_color(200, 167, 107)
        self.cell(0, 15, 'Real Estate', align='C', new_x='LMARGIN', new_y='NEXT')
        self.cell(0, 15, 'Prompt Pack', align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(10)
        self.set_font('Helvetica', '', 14)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, '50 Ready-to-Use AI Prompts', align='C', new_x='LMARGIN', new_y='NEXT')
        self.cell(0, 8, 'For Agents, Investors, Property Managers & Brokers', align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(30)
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(99, 102, 241)
        self.cell(0, 8, 'By Claude.FO', align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(5)
        self.set_font('Helvetica', '', 10)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, 'Replace [BRACKETS] with your details. Paste into any AI chatbot.', align='C', new_x='LMARGIN', new_y='NEXT')

    def add_section_header(self, title):
        self.add_page()
        self.ln(5)
        self.set_font('Helvetica', 'B', 18)
        self.set_text_color(200, 167, 107)
        self.cell(0, 12, sanitize(title), new_x='LMARGIN', new_y='NEXT')
        self.set_draw_color(200, 167, 107)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(8)

    def add_prompt(self, number, title, content):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(240, 240, 240)
        self.cell(0, 8, sanitize(f'#{number}  {title}'), new_x='LMARGIN', new_y='NEXT')
        self.ln(3)

        self.set_font('Courier', '', 9)
        self.set_text_color(180, 180, 180)
        self.set_fill_color(25, 25, 35)

        content = sanitize(content.strip())
        x = self.get_x()
        y = self.get_y()
        self.set_x(12)
        self.multi_cell(186, 5, content, fill=True)
        self.ln(8)


def parse_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    sections = []
    current_section = None
    current_prompts = []

    for line in text.split('\n'):
        if line.startswith('## Category') or line.startswith('## Category'):
            if current_section:
                sections.append((current_section, current_prompts))
            match = re.search(r'Category \d+: (.+)', line)
            if match:
                current_section = match.group(1).strip()
            else:
                current_section = line.replace('## ', '').strip()
            current_prompts = []
        elif line.startswith('### '):
            match = re.match(r'### (\d+)\. (.+)', line)
            if match:
                current_prompts.append({'number': int(match.group(1)), 'title': match.group(2).strip(), 'content': ''})
        elif line.startswith('```') and current_prompts:
            continue
        elif current_prompts and current_prompts[-1]['content'] is not None:
            if not line.startswith('#') and not line.startswith('---'):
                current_prompts[-1]['content'] += line + '\n'

    if current_section:
        sections.append((current_section, current_prompts))

    return sections


def generate():
    pdf = PromptPackPDF()
    pdf.alias_nb_pages()
    pdf.set_fill_color(15, 15, 20)

    # Cover
    pdf.add_cover()

    # How to use
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(240, 240, 240)
    pdf.cell(0, 10, 'How to Use This Pack', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(5)
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(180, 180, 180)
    steps = [
        '1.  Copy any prompt from this pack',
        '2.  Replace the [BRACKETS] with your specific details',
        '3.  Paste into ChatGPT, Claude, Gemini, or any AI chatbot',
        '4.  Get professional results in seconds',
        '',
        'Each prompt is designed to save you 30-60 minutes of writing time.',
        'Use them for listings, tenant emails, marketing, reports, and more.',
    ]
    for step in steps:
        pdf.cell(0, 7, step, new_x='LMARGIN', new_y='NEXT')

    # Parse and add all sections
    sections = parse_markdown('c:/Users/ekzgr/Downloads/CLAUDE.FO/products/real-estate-prompt-pack.md')
    for section_title, prompts in sections:
        pdf.add_section_header(section_title)
        for p in prompts:
            if p['title'] and p['content'].strip():
                pdf.add_prompt(p['number'], p['title'], p['content'].strip())

    # Back cover
    pdf.add_page()
    pdf.ln(50)
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(200, 167, 107)
    pdf.cell(0, 12, 'Thank you for your purchase!', align='C', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(0, 8, 'Need custom prompts for your business?', align='C', new_x='LMARGIN', new_y='NEXT')
    pdf.cell(0, 8, 'Visit claude-fo.vercel.app/contact', align='C', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(15)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 6, 'Browse more products at claude-fo.vercel.app/store', align='C', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(20)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(99, 102, 241)
    pdf.cell(0, 6, 'Claude.FO - Premium Digital Agency', align='C', new_x='LMARGIN', new_y='NEXT')

    output_path = 'c:/Users/ekzgr/Downloads/CLAUDE.FO/products/Real-Estate-Prompt-Pack-ClaudeFO.pdf'
    pdf.output(output_path)
    print(f'PDF generated: {output_path}')
    print(f'Pages: {pdf.pages_count}')


if __name__ == '__main__':
    generate()

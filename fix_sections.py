import re

with open('medinova/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove sections: packages, testimonials, appointment
# Strategy: find end of stories section, then find start of footer, keep everything between as empty
sections_to_remove = ['packages', 'testimonials', 'appointment']

for section_id in sections_to_remove:
    # Pattern to match the full section from opening tag to closing </section>
    pattern = r'(?s)\s*<!--[^>]*?-->\s*<section id="' + section_id + r'"[^>]*>.*?</section>'
    content = re.sub(pattern, '', content)

with open('medinova/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Sections removed successfully.")

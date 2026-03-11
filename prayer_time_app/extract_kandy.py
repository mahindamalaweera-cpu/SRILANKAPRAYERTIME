import pypdf

try:
    reader = pypdf.PdfReader('prayer_times.pdf')
    kandy_pages = []
    for i, page in enumerate(reader.pages):
        text = str(page.extract_text() or '')
        if 'KANDY' in text.upper() or 'ZONE: 07' in text.upper() or 'ZONE:07' in text.upper():
            kandy_pages.append(f"PAGE {i+1}\n\n" + text)
    with open('kandy_data.txt', 'w', encoding='utf-8') as f:
        f.write('\n==========================\n'.join(kandy_pages))
    print(f"Found Kandy data on {len(kandy_pages)} pages using pypdf.")
except Exception as e:
    print("pypdf error:", e)

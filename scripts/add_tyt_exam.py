"""
=============================================================================
PRODİL TYT DENEME VE CEVAP ANAHTARI OTOMATİK İÇE AKTARMA ARACI (add_tyt_exam.py)
=============================================================================
Kullanım:
    python scripts/add_tyt_exam.py <csv_yolu> [id] [baslik] [tarih] [yayinZamani] [kilitliGoster]

Örnekler:
    1) Hemen Yayında:
       python scripts/add_tyt_exam.py data/miray_tyt_2.csv miray-tyt-2 "MİRAY TYT 2. Kurumsal Deneme" "03.11.2026"

    2) İleri Tarihli Yayın (Kilitli & Geri Sayımlı):
       python scripts/add_tyt_exam.py data/miray_tyt_2.csv miray-tyt-2 "MİRAY TYT 2. Kurumsal Deneme" "03.11.2026" "03.11.2026 18:00" true
=============================================================================
"""

import sys
import os
import csv
import json
import re

def parse_tyt_csv(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV dosyası bulunamadı: {file_path}")

    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows = list(reader)

    sections = [
        {"id": "turkce", "title": "TYT Türkçe", "testName": "TYT Türkçe", "count": 40},
        {"id": "sosyal", "title": "TYT Sosyal", "testName": "TYT Sosyal", "count": 20},
        {"id": "matematik", "title": "TYT Matematik", "testName": "TYT Matematik", "count": 40},
        {"id": "fen", "title": "TYT Fen", "testName": "TYT Fen", "count": 20}
    ]

    section_map = {s["testName"]: [] for s in sections}

    for r in rows:
        if not r or len(r) < 6:
            continue
        booklet = r[0].strip()
        test = r[1].strip()
        ders = r[2].strip()
        try:
            a_no = int(r[3].strip())
            b_no = int(r[4].strip())
        except ValueError:
            continue

        cevap = r[5].strip().upper()
        kazanim_kod = r[6].strip() if len(r) > 6 else ""
        kazanim = r[7].strip() if len(r) > 7 else ""
        if len(r) > 8 and r[8].strip():
            kazanim += " - " + r[8].strip()

        item = {
            "test": test,
            "ders": ders,
            "aNo": a_no,
            "bNo": b_no,
            "cevap": cevap,
            "kod": kazanim_kod,
            "kazanim": kazanim
        }
        if test in section_map:
            section_map[test].append(item)

    answers_a_str = ""
    answers_b_str = ""
    details_a = []
    details_b = []

    global_a_idx = 1
    global_b_idx = 1

    for s in sections:
        q_list = section_map[s["testName"]]
        sorted_a = sorted(q_list, key=lambda x: x["aNo"])
        sorted_b = sorted(q_list, key=lambda x: x["bNo"])

        for q in sorted_a:
            answers_a_str += q["cevap"]
            q_copy = dict(q)
            q_copy["globalNo"] = global_a_idx
            q_copy["secNo"] = q["aNo"]
            q_copy["secId"] = s["id"]
            details_a.append(q_copy)
            global_a_idx += 1

        for q in sorted_b:
            answers_b_str += q["cevap"]
            q_copy = dict(q)
            q_copy["globalNo"] = global_b_idx
            q_copy["secNo"] = q["bNo"]
            q_copy["secId"] = s["id"]
            details_b.append(q_copy)
            global_b_idx += 1

    return {
        "answers_a_str": answers_a_str,
        "answers_b_str": answers_b_str,
        "details_a": details_a,
        "details_b": details_b
    }

def add_exam(csv_path, exam_id, baslik, tarih, yayin_zamani="", kilitli_goster=True, aciklama=""):
    parsed = parse_tyt_csv(csv_path)

    if not aciklama:
        if yayin_zamani:
            aciklama = f"Cevap anahtarı {yayin_zamani} tarihinde erişime açılacaktır."
        else:
            aciklama = f"{baslik} cevap anahtarı, A/B kitapçığı ve konu kazanımları."

    new_exam = {
        "id": exam_id,
        "tur": "sinav",
        "sinavTuru": "tyt",
        "baslik": baslik,
        "tarih": tarih,
        "yayinZamani": yayin_zamani,
        "kilitliGoster": bool(kilitli_goster),
        "kategori": "TYT Deneme",
        "aciklama": aciklama,
        "cevaplarA": parsed["answers_a_str"],
        "cevaplarB": parsed["answers_b_str"],
        "sorularA": parsed["details_a"],
        "sorularB": parsed["details_b"]
    }

    with open("duyurular.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Varsa eskisini temizle
    pattern = rf'\{{\s*"id":\s*"{re.escape(exam_id)}"[\s\S]*?\n    \}},?'
    content = re.sub(pattern, '', content)

    insert_pos = content.find("const PRODIL_DUYURULAR = [")
    if insert_pos == -1:
        raise ValueError("duyurular.js içinde 'const PRODIL_DUYURULAR = [' bulunamadı!")

    bracket_pos = content.find("[", insert_pos)
    item_json = json.dumps(new_exam, ensure_ascii=False, indent=8)

    new_content = (
        content[:bracket_pos+1] + "\n    " +
        item_json + ",\n" +
        content[bracket_pos+1:].lstrip()
    )

    with open("duyurular.js", "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Başarılı! Sınav '{baslik}' ({exam_id}) duyurular.js dosyasına eklendi.")
    print(f"Toplam A Sorusu: {len(parsed['answers_a_str'])}, Toplam B Sorusu: {len(parsed['answers_b_str'])}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
        e_id = sys.argv[2] if len(sys.argv) > 2 else "miray-tyt-1"
        e_title = sys.argv[3] if len(sys.argv) > 3 else "MİRAY TYT 1. Kurumsal Deneme"
        e_date = sys.argv[4] if len(sys.argv) > 4 else "27.10.2026"
        e_time = sys.argv[5] if len(sys.argv) > 5 else ""
        e_lock = (sys.argv[6].lower() == "true") if len(sys.argv) > 6 else True
        add_exam(csv_file, e_id, e_title, e_date, e_time, e_lock)
    else:
        # Varsayılan MİRAY TYT 1
        add_exam("data/miray_tyt_1.csv", "miray-tyt-1", "MİRAY TYT 1. Kurumsal Deneme", "27.10.2026")

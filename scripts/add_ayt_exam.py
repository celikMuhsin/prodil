"""
=============================================================================
PRODİL AYT DENEME VE CEVAP ANAHTARI OTOMATİK İÇE AKTARMA ARACI (add_ayt_exam.py)
=============================================================================
Kullanım:
    python scripts/add_ayt_exam.py [csv_yolu] [id] [baslik] [tarih] [yayinZamani] [kilitliGoster]
=============================================================================
"""

import sys
import os
import csv
import json
import re

def normalize_ders(test, ders, a_no):
    d = ders.strip()
    # Din Kültürü normalizasyonu
    if d.lower().startswith("din"):
        return "Din Kültürü"
    
    # Matematik testindeki 31-40 arası sorular Geometri'dir
    if test == "Matematik":
        if a_no >= 31:
            return "Geometri"
        return "Matematik"
    
    if d == "Matematik-2" or d == "Matematik-1":
        return "Matematik"
    
    return d

def parse_ayt_csv(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV dosyası bulunamadı: {file_path}")

    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)

    # Başlık satırını bul (Kitapçık ile başlayan satır)
    header_idx = -1
    for i, r in enumerate(rows):
        if r and r[0].strip().lower() in ["kitapçık", "kitapcik"]:
            header_idx = i
            break

    if header_idx != -1:
        rows = rows[header_idx + 1:]

    tests = [
        {"id": "edebiyat_sos1", "title": "Türk Dili ve Ed. - Sosyal-1", "testName": "Edebiyat-Sosyal-1", "count": 40},
        {"id": "sosyal2", "title": "Sosyal Bilimler-2", "testName": "Sosyal-2", "count": 40},
        {"id": "matematik", "title": "Matematik", "testName": "Matematik", "count": 40},
        {"id": "fen", "title": "Fen Bilimleri", "testName": "Fen Bilimleri", "count": 40}
    ]

    test_map = {t["testName"]: [] for t in tests}

    for r in rows:
        if not r or len(r) < 6:
            continue
        booklet = r[0].strip()
        test = r[1].strip()
        raw_ders = r[2].strip()
        try:
            a_no = int(r[3].strip())
            b_no = int(r[4].strip())
        except ValueError:
            continue

        cevap = r[5].strip().upper()
        kazanim_kod = r[6].strip() if len(r) > 6 else ""
        
        # Tüm kazanım kolonlarını birleştir (boş olmayanları)
        kazanim_parts = []
        for col_idx in range(7, len(r)):
            val = r[col_idx].strip()
            if val and val not in kazanim_parts:
                kazanim_parts.append(val)
        kazanim = " - ".join(kazanim_parts)

        ders = normalize_ders(test, raw_ders, a_no)

        item = {
            "test": test,
            "ders": ders,
            "rawDers": raw_ders,
            "aNo": a_no,
            "bNo": b_no,
            "cevap": cevap,
            "kod": kazanim_kod,
            "kazanim": kazanim
        }
        if test in test_map:
            test_map[test].append(item)

    answers_a_str = ""
    answers_b_str = ""
    details_a = []
    details_b = []

    global_a_idx = 1
    global_b_idx = 1

    for t in tests:
        q_list = test_map[t["testName"]]
        sorted_a = sorted(q_list, key=lambda x: x["aNo"])
        sorted_b = sorted(q_list, key=lambda x: x["bNo"])

        for q in sorted_a:
            answers_a_str += q["cevap"]
            q_copy = dict(q)
            q_copy["globalNo"] = global_a_idx
            q_copy["secNo"] = q["aNo"]
            q_copy["secId"] = t["id"]
            details_a.append(q_copy)
            global_a_idx += 1

        for q in sorted_b:
            answers_b_str += q["cevap"]
            q_copy = dict(q)
            q_copy["globalNo"] = global_b_idx
            q_copy["secNo"] = q["bNo"]
            q_copy["secId"] = t["id"]
            # B kitapçığındaki dersi, B soru numarasına göre Geometri kontrolünden geçir
            if t["testName"] == "Matematik":
                q_copy["ders"] = "Geometri" if q["bNo"] >= 31 else "Matematik"
            details_b.append(q_copy)
            global_b_idx += 1

    return {
        "answers_a_str": answers_a_str,
        "answers_b_str": answers_b_str,
        "details_a": details_a,
        "details_b": details_b
    }

def add_ayt_exam(csv_path, exam_id, baslik, tarih, yayin_zamani="", kilitli_goster=True, aciklama=""):
    parsed = parse_ayt_csv(csv_path)

    if not aciklama:
        if yayin_zamani:
            aciklama = f"Cevap anahtarı {yayin_zamani} tarihinde erişime açılacaktır."
        else:
            aciklama = f"{baslik} cevap anahtarı, A/B kitapçığı ve konu kazanımları."

    new_exam = {
        "id": exam_id,
        "tur": "sinav",
        "sinavTuru": "ayt",
        "baslik": baslik,
        "tarih": tarih,
        "yayinZamani": yayin_zamani,
        "kilitliGoster": bool(kilitli_goster),
        "kategori": "AYT Deneme",
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
    return new_exam

if __name__ == "__main__":
    csv_file = sys.argv[1] if len(sys.argv) > 1 else "data/miray_ayt_1.csv"
    e_id = sys.argv[2] if len(sys.argv) > 2 else "miray-ayt-1"
    e_title = sys.argv[3] if len(sys.argv) > 3 else "MİRAY AYT 1. Kurumsal Deneme"
    e_date = sys.argv[4] if len(sys.argv) > 4 else "02.11.2026"
    e_time = sys.argv[5] if len(sys.argv) > 5 else ""
    e_lock = (sys.argv[6].lower() == "true") if len(sys.argv) > 6 else True
    add_ayt_exam(csv_file, e_id, e_title, e_date, e_time, e_lock)

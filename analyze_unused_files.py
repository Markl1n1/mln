#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для анализа неиспользуемых файлов на сайте.
Проверяет использование файлов в HTML, CSS, JS и других файлах.
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict
from urllib.parse import unquote

# Исправляем кодировку вывода для Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Корневая директория проекта
ROOT_DIR = Path(r"C:\Users\mark.lindt\Desktop\Brand\mln")

# Расширения файлов для проверки
TARGET_EXTENSIONS = {'.html', '.css', '.png', '.jpg', '.jpeg', '.svg', '.pdf', '.js'}

# Исключаемые директории
EXCLUDED_DIRS = {'wp-includes', 'wp-content/plugins', 'wp-json'}

def normalize_path(path_str):
    """Нормализует путь для сравнения"""
    # Убираем начальный слэш, приводим к нижнему регистру, заменяем обратные слэши
    path = path_str.replace('\\', '/').strip('/')
    # Декодируем URL-кодирование если есть
    path = unquote(path)
    return path.lower()

def get_all_files():
    """Собирает все файлы указанных типов"""
    all_files = []
    for root, dirs, files in os.walk(ROOT_DIR):
        # Исключаем директории
        dirs[:] = [d for d in dirs if not any(excluded in os.path.join(root, d) for excluded in EXCLUDED_DIRS)]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in TARGET_EXTENSIONS:
                rel_path = file_path.relative_to(ROOT_DIR)
                # Проверяем, не в исключенной директории
                if not any(excluded in str(rel_path) for excluded in EXCLUDED_DIRS):
                    all_files.append(rel_path)
    return all_files

def extract_file_references(content, file_path):
    """Извлекает ссылки на файлы из содержимого"""
    references = set()
    
    # Паттерны для поиска ссылок на файлы
    patterns = [
        # HTML атрибуты
        r'(?:src|href|data-src|data-srcset|data-background|data-bg)=["\']([^"\']+\.(?:png|jpg|jpeg|svg|pdf|css|js|html))["\']',
        # CSS url()
        r'url\(["\']?([^)"\']+\.(?:png|jpg|jpeg|svg|pdf|css|js))["\']?\)',
        # Встроенные стили
        r'background-image:\s*url\(["\']?([^)"\']+\.(?:png|jpg|jpeg|svg|pdf))["\']?\)',
        # Мета-теги
        r'(?:og:image|twitter:image|image)\s*content=["\']([^"\']+\.(?:png|jpg|jpeg|svg|pdf))["\']',
        # JSON-LD схемы
        r'"(?:url|contentUrl|logo|image)":\s*["\']([^"\']+\.(?:png|jpg|jpeg|svg|pdf))["\']',
        # Импорты в CSS
        r'@import\s+["\']([^"\']+\.(?:css))["\']',
        # Строковые литералы в JS (более общий паттерн)
        r'["\']([^"\']*/(?:[^"\']+\.(?:png|jpg|jpeg|svg|pdf|css|js|html)))["\']',
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            ref_path = match.group(1)
            # Нормализуем путь
            normalized = normalize_path(ref_path)
            if normalized:
                references.add(normalized)
                # Также добавляем только имя файла для дополнительной проверки
                if '/' in normalized or '\\' in normalized:
                    file_name = normalized.split('/')[-1].split('\\')[-1]
                    if file_name:
                        references.add(file_name)
    
    return references

def find_file_references():
    """Находит все ссылки на файлы в проекте"""
    file_references = defaultdict(set)
    
    # Сканируем все HTML, CSS, JS файлы
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if not any(excluded in os.path.join(root, d) for excluded in EXCLUDED_DIRS)]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in {'.html', '.css', '.js'}:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        refs = extract_file_references(content, file_path)
                        rel_path = file_path.relative_to(ROOT_DIR)
                        file_references[normalize_path(str(rel_path))] = refs
                except Exception as e:
                    print(f"Ошибка при чтении {file_path}: {e}")
    
    return file_references

def analyze_unused_files():
    """Анализирует и находит неиспользуемые файлы"""
    print("Collecting all files...")
    all_files = get_all_files()
    print(f"Found files: {len(all_files)}")
    
    print("Searching for file references...")
    file_references = find_file_references()
    
    # Создаем множество всех упоминаемых файлов
    referenced_files = set()
    for refs in file_references.values():
        referenced_files.update(refs)
    
    # Нормализуем пути всех файлов
    normalized_all_files = {normalize_path(str(f)): f for f in all_files}
    
    # Находим неиспользуемые файлы
    unused_files = []
    for norm_path, orig_path in normalized_all_files.items():
        # Проверяем, упоминается ли файл где-либо
        is_used = False
        
        file_name = orig_path.name.lower()
        file_name_no_ext = Path(orig_path).stem.lower()
        
        # Прямое упоминание полного пути
        if norm_path in referenced_files:
            is_used = True
        
        # Проверяем упоминание имени файла
        if file_name in referenced_files:
            is_used = True
        
        # Проверяем упоминание в ссылках (может быть относительный путь)
        for ref in referenced_files:
            ref_lower = ref.lower()
            # Точное совпадение имени файла в конце пути
            if ref_lower.endswith('/' + file_name) or ref_lower.endswith('\\' + file_name) or ref_lower == file_name:
                is_used = True
                break
            # Имя файла содержится в ссылке
            if '/' + file_name in ref_lower or '\\' + file_name in ref_lower:
                is_used = True
                break
            # Путь содержится в ссылке или наоборот
            if norm_path in ref_lower or ref_lower in norm_path:
                is_used = True
                break
        
        # Для HTML файлов - проверяем, не является ли это индексной страницей
        if orig_path.suffix.lower() == '.html':
            # index.html обычно используется
            if 'index.html' in file_name:
                is_used = True
        
        if not is_used:
            unused_files.append(orig_path)
    
    return unused_files, all_files, referenced_files

if __name__ == "__main__":
    unused, all_files, referenced = analyze_unused_files()
    
    print(f"\nTotal files: {len(all_files)}")
    print(f"Referenced files: {len(referenced)}")
    print(f"Unused files: {len(unused)}")
    
    # Сохраняем результаты
    with open('unused_files_report.txt', 'w', encoding='utf-8') as f:
        f.write("UNUSED FILES REPORT\n")
        f.write("=" * 80 + "\n\n")
        for file in sorted(unused):
            f.write(f"{file}\n")
    
    print(f"\nReport saved to unused_files_report.txt")
    print(f"\nFirst 20 unused files:")
    for file in sorted(unused)[:20]:
        print(f"  {file}")


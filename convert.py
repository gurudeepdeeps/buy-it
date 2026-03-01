import os
import glob
import re
import math

def format_inr(number):
    s, *d = str(number).partition('.')
    r = ','.join([s[x-2:x] for x in range(-3, -len(s), -2)][::-1] + [s[-3:]])
    return ''.join([r] + d)

def replacer(match):
    num_str = match.group(1).replace(',', '')
    is_k = False
    if num_str.lower().endswith('k'):
        is_k = True
        num_str = num_str[:-1]
    
    val = float(num_str)
    if is_k:
        val *= 1000
        
    inr_val = val * 83
    inr_val = int(math.ceil(inr_val))
    
    formatted = format_inr(inr_val)
    return f'₹{formatted}'

def price_replacer(match):
    prefix = match.group(1)
    val = float(match.group(2))
    inr_val = int(math.ceil(val * 83))
    return f'{prefix}{inr_val}'

def main():
    directory = r'c:\Users\gurud\Downloads\Hub'
    html_files = glob.glob(os.path.join(directory, '*.html'))
    js_files = glob.glob(os.path.join(directory, '*.js'))
    all_files = html_files + js_files
    for file_path in all_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # fix Intl.NumberFormat in cart and wishlist JS
        new_content = new_content.replace(
            "new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })",
            "new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })"
        )
        
        new_content = re.sub(
            r"new Intl\.NumberFormat\('en-US',\s*\{\s*style:\s*'currency',\s*currency:\s*'USD',?\s*\}\)",
            r"new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })",
            new_content
        )
        
        # Also fix any single-line spacing variations
        new_content = new_content.replace(
            "new Intl.NumberFormat('en-US', {\n                    style: 'currency',\n                    currency: 'USD',\n                })",
            "new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })"
        )
                         
        # regex for display prices like $1,200.00, $15.00, $80k
        new_content = re.sub(r'\$([0-9,]+(?:\.[0-9]{2})?|[0-9]+k)', replacer, new_content)
        
        # regex for js object prices
        new_content = re.sub(r'(price:\s*)([0-9]+(?:\.[0-9]+)?)', price_replacer, new_content)
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {os.path.basename(file_path)}')

if __name__ == '__main__':
    main()

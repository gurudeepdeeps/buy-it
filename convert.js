const fs = require('fs');
const path = require('path');

function replacer(match, numStr) {
    numStr = numStr.replace(/,/g, '');
    let isK = false;
    if (numStr.toLowerCase().endsWith('k')) {
        isK = true;
        numStr = numStr.slice(0, -1);
    }

    let val = parseFloat(numStr);
    if (isK) val *= 1000;

    let inrVal = Math.ceil(val * 83);
    // NumberFormat en-IN gives us the correct comma placement for Indian Rupees
    return '₹' + inrVal.toLocaleString('en-IN');
}

function priceReplacer(match, prefix, valStr) {
    let val = parseFloat(valStr);
    let inrVal = Math.ceil(val * 83);
    return prefix + inrVal;
}

const directory = 'c:\\Users\\gurud\\Downloads\\Hub';
const files = fs.readdirSync(directory);
const validExts = ['.html', '.js'];
const targetFiles = files.filter(f => validExts.includes(path.extname(f))).map(f => path.join(directory, f));

for (const filePath of targetFiles) {
    if (filePath.endsWith('convert.js')) continue;
    if (filePath.endsWith('shop.js')) {
        // We will process this too
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    // fix Intl.NumberFormat in cart and wishlist JS
    newContent = newContent.replace(
        "new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })",
        "new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })"
    );

    newContent = newContent.replace(
        "new Intl.NumberFormat('en-US', {\n                    style: 'currency',\n                    currency: 'USD',\n                })",
        "new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })"
    );

    newContent = newContent.replace(
        /new Intl\.NumberFormat\('en-US',\s*\{\s*style:\s*'currency',\s*currency:\s*'USD',?\s*\}\)/g,
        "new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })"
    );

    // regex for display prices
    // Check for $ followed by numbers, optionally with ',' and optionally with two decimals or 'k'
    newContent = newContent.replace(/\$([0-9,]+(?:\.[0-9]{2})?|[0-9]+k)/gi, replacer);

    // regex for js object prices (price: 2499.00 -> price: 207417)
    newContent = newContent.replace(/(price:\s*)([0-9]+(?:\.[0-9]+)?)/gi, priceReplacer);

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}


// Canvas and context
const canvas = document.getElementById('stampCanvas');
const ctx = canvas.getContext('2d');

// Current color
let currentColor = '#000000';

// Selected element for dragging
let selectedElement = null;
let isDragging = false;
let dragStartX, dragStartY;

// Sign image data
let signImage = null;

// Elements list
const elements = [
    { id: 'topText', name: 'Top Text', type: 'text' },
    { id: 'bottomText', name: 'Bottom Text', type: 'text' },
    { id: 'center1', name: 'Owner Name', type: 'text' },
    { id: 'center2', name: 'Address', type: 'text' },
    { id: 'center3', name: 'ID/Code', type: 'text' },
    { id: 'leftStar', name: 'Left Star', type: 'star' },
    { id: 'rightStar', name: 'Right Star', type: 'star' },
    { id: 'line1', name: 'Line 1', type: 'line' },
    { id: 'line2', name: 'Line 2', type: 'line' },
    { id: 'sign', name: 'Sign/Logo', type: 'sign' },
    { id: 'shape', name: 'Shape/Logo', type: 'shape' },
    { id: 'outerRing', name: 'Outer Ring', type: 'ring' },
    { id: 'innerRing', name: 'Inner Ring', type: 'ring' }
];

// Initialize
window.addEventListener('load', () => {
    populateElementList();
    drawStamp();
    updateAllValues();
    setupDragAndDrop();
    setupSignUpload();
});

// Populate element list
function populateElementList() {
    const list = document.getElementById('elementList');
    list.innerHTML = '';
    elements.forEach(element => {
        const div = document.createElement('div');
        div.className = 'element-item';
        div.dataset.id = element.id;
        div.innerHTML = `
                    <span class="drag-handle">☰</span>
                    <span>${element.name}</span>
                    <span class="element-type">${element.type}</span>
                `;
        div.addEventListener('click', () => selectElement(element.id));
        list.appendChild(div);
    });
}

// Select element
function selectElement(id) {
    document.querySelectorAll('.element-item').forEach(el => {
        el.classList.remove('selected');
    });
    const selected = document.querySelector(`[data-id="${id}"]`);
    if (selected) {
        selected.classList.add('selected');
        selectedElement = id;
        document.getElementById('canvasOverlay').innerHTML = `Selected: ${elements.find(e => e.id === id).name} - Drag to move`;
    }
}

// Setup drag and drop
function setupDragAndDrop() {
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', onDrag);
    canvas.addEventListener('mouseup', stopDrag);
    canvas.addEventListener('mouseleave', stopDrag);
}

function startDrag(e) {
    if (!selectedElement) return;

    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    dragStartX = (e.clientX - rect.left) * scaleX;
    dragStartY = (e.clientY - rect.top) * scaleY;
}

function onDrag(e) {
    if (!isDragging || !selectedElement) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const dx = currentX - dragStartX;
    const dy = currentY - dragStartY;

    // Update based on selected element
    switch (selectedElement) {
        case 'leftStar':
            updateRange('leftStarX', dx);
            updateRange('leftStarY', dy);
            break;
        case 'rightStar':
            updateRange('rightStarX', dx);
            updateRange('rightStarY', dy);
            break;
        case 'center1':
            updateRange('center1X', dx);
            updateRange('center1Y', dy);
            break;
        case 'center2':
            updateRange('center2X', dx);
            updateRange('center2Y', dy);
            break;
        case 'center3':
            updateRange('center3X', dx);
            updateRange('center3Y', dy);
            break;
        case 'line1':
            updateRange('line1X', dx);
            updateRange('line1Y', dy);
            break;
        case 'line2':
            updateRange('line2X', dx);
            updateRange('line2Y', dy);
            break;
        case 'sign':
            updateRange('signX', dx);
            updateRange('signY', dy);
            break;
        case 'shape':
            updateRange('shapeX', dx);
            updateRange('shapeY', dy);
            break;
    }

    dragStartX = currentX;
    dragStartY = currentY;

    drawStamp();
}

function updateRange(id, delta) {
    const input = document.getElementById(id);
    if (input) {
        let newValue = parseInt(input.value) + delta;
        // Clamp values
        newValue = Math.max(parseInt(input.min), Math.min(parseInt(input.max), newValue));
        input.value = newValue;
        document.getElementById(id + 'Value').textContent = newValue + 'px';
    }
}

function stopDrag() {
    isDragging = false;
}

// Toggle accordion
function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
    const arrow = header.querySelector('span:last-child');
    arrow.textContent = item.classList.contains('active') ? '▼' : '▶';
}

// Update all displayed values
function updateAllValues() {
    const rangeIds = [
        'diameter', 'rotation', 'outerRing', 'middleRing', 'innerRing', 'ringSpacing',
        'ringOffsetX', 'ringOffsetY', 'topFontSize', 'topRadius',
        'topStartAngle', 'topEndAngle', 'bottomFontSize', 'bottomRadius',
        'bottomStartAngle', 'bottomEndAngle', 'center1Size', 'center1X',
        'center1Y', 'center2Size', 'center2X', 'center2Y', 'center3Size',
        'center3X', 'center3Y', 'leftStarSize', 'leftStarX', 'leftStarY',
        'rightStarSize', 'rightStarX', 'rightStarY', 'shapeSize', 'shapeX',
        'shapeY', 'shapeRotation', 'shapeOpacity', 'dashPattern', 'dashGap',
        'shadowBlur', 'shadowOffsetX', 'shadowOffsetY', 'signWidth', 'signHeight',
        'signX', 'signY', 'signRotation', 'signOpacity', 'line1Length', 'line1Thickness',
        'line1X', 'line1Y', 'line1Rotation', 'line2Length', 'line2Thickness',
        'line2X', 'line2Y', 'line2Rotation'
    ];

    rangeIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const value = element.value;
            const span = document.getElementById(id + 'Value');
            if (span) {
                let unit = 'px';
                if (id.includes('Opacity')) unit = '';
                if (id.includes('Angle') || id.includes('rotation')) unit = '°';
                if (id.includes('Size') && !id.includes('Opacity')) unit = 'px';
                span.textContent = value + unit;
            }
        }
    });
}

// Color selection
function setColor(color) {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
    document.querySelector(`.color-option.${color}`).classList.add('active');

    const colors = {
        black: '#000000',
        blue: '#2b6c9e',
        red: '#c41e3a',
        green: '#2e7d32',
        purple: '#6a1b9a',
        orange: '#e65100'
    };
    currentColor = colors[color];
    drawStamp();
}

// Setup sign upload
function setupSignUpload() {
    const uploadArea = document.getElementById('signUploadArea');
    const signInput = document.getElementById('signInput');
    const signPreview = document.getElementById('signPreview');

    uploadArea.addEventListener('click', () => signInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#e8e8ff';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '#f0f0ff';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f0f0ff';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleSignUpload(file);
        }
    });

    signInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleSignUpload(e.target.files[0]);
        }
    });
}

function handleSignUpload(file) {
    if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        signImage = new Image();
        signImage.onload = () => {
            document.getElementById('signPreview').src = e.target.result;
            document.getElementById('signPreview').style.display = 'block';
            document.getElementById('enableSign').checked = true;
            drawStamp();
        };
        signImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Get font style string
function getFontStyle(bold, italic, underline, size, family) {
    let style = '';
    if (italic) style += 'italic ';
    if (bold) style += 'bold ';
    style += size + 'px ' + family;
    return style;
}

// Draw curved text
function drawCurvedText(text, centerX, centerY, radius, startAngle, endAngle, fontSize, fontFamily, bold = false, italic = false, underline = false) {
    if (!text) return;

    const characters = text.split('');
    const angleRange = (endAngle - startAngle) * Math.PI / 180;
    const angleStep = angleRange / (characters.length - 1);

    ctx.save();
    ctx.translate(centerX, centerY);

    ctx.font = getFontStyle(bold, italic, underline, fontSize, fontFamily);

    characters.forEach((char, index) => {
        const charAngle = (startAngle * Math.PI / 180) + (index * angleStep);
        const x = radius * Math.cos(charAngle);
        const y = radius * Math.sin(charAngle);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(charAngle + Math.PI / 2);
        ctx.fillStyle = currentColor;

        // Handle underline
        if (underline) {
            const metrics = ctx.measureText(char);
            const textWidth = metrics.width;
            ctx.fillRect(-textWidth / 2, fontSize / 2, textWidth, 1);
        }

        ctx.fillText(char, 0, 0);
        ctx.restore();
    });

    ctx.restore();
}

// Draw star
function drawStar(cx, cy, spikes, outerR, innerR, color, rotation = 0) {
    let rot = (Math.PI / 2 * 3) + (rotation * Math.PI / 180);
    let step = Math.PI / spikes;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.beginPath();

    for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * outerR;
        let y = Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerR;
        y = Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// Draw line
function drawLine(centerX, centerY, length, thickness, xOffset, yOffset, rotation, isDouble, isDashed, color) {
    ctx.save();
    ctx.translate(centerX + xOffset, centerY + yOffset);
    ctx.rotate(rotation * Math.PI / 180);

    if (isDashed) {
        ctx.setLineDash([5, 3]);
    } else {
        ctx.setLineDash([]);
    }

    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;

    if (isDouble) {
        // Double line
        ctx.beginPath();
        ctx.moveTo(-length / 2, -thickness);
        ctx.lineTo(length / 2, -thickness);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-length / 2, thickness);
        ctx.lineTo(length / 2, thickness);
        ctx.stroke();
    } else {
        // Single line
        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        ctx.lineTo(length / 2, 0);
        ctx.stroke();
    }

    ctx.restore();
}

// Draw shape
function drawShape() {
    if (!document.getElementById('enableLogo').checked) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = parseInt(document.getElementById('shapeSize').value);
    const x = centerX + parseInt(document.getElementById('shapeX').value);
    const y = centerY + parseInt(document.getElementById('shapeY').value);
    const rotation = parseInt(document.getElementById('shapeRotation').value);
    const opacity = parseFloat(document.getElementById('shapeOpacity').value);
    const shapeType = document.getElementById('shapeType').value;
    const customText = document.getElementById('customShapeText').value;
    const bold = document.getElementById('shapeBold').checked;
    const italic = document.getElementById('shapeItalic').checked;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.fillStyle = currentColor;

    switch (shapeType) {
        case 'star':
            drawStar(0, 0, 5, size / 2, size / 4, currentColor);
            break;
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(-size / 2, -size / 2, size, size);
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(size / 2, size / 2);
            ctx.lineTo(-size / 2, size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(size / 2, 0);
            ctx.lineTo(0, size / 2);
            ctx.lineTo(-size / 2, 0);
            ctx.closePath();
            ctx.fill();
            break;
        case 'hexagon':
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                let angle = i * Math.PI / 3;
                let xPos = (size / 2) * Math.cos(angle);
                let yPos = (size / 2) * Math.sin(angle);
                if (i === 0) ctx.moveTo(xPos, yPos);
                else ctx.lineTo(xPos, yPos);
            }
            ctx.closePath();
            ctx.fill();
            break;
        case 'logo':
            ctx.font = getFontStyle(bold, italic, false, size, 'Arial');
            ctx.fillStyle = currentColor;
            ctx.fillText('CSC', -size / 2, size / 4);
            break;
        case 'custom':
            ctx.font = getFontStyle(bold, italic, false, size, 'Arial');
            ctx.fillStyle = currentColor;
            ctx.fillText(customText, -size / 2, size / 4);
            break;
    }

    ctx.restore();
}

// Set line dash style
function setLineStyle(style, dashPattern, dashGap) {
    if (style === 'dashed') {
        ctx.setLineDash([dashPattern, dashGap]);
    } else if (style === 'dotted') {
        ctx.setLineDash([1, dashGap]);
    } else if (style === 'double') {
        ctx.lineWidth = ctx.lineWidth / 2;
    } else {
        ctx.setLineDash([]);
    }
}

// Main stamp drawing function
function drawStamp() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Get values
    const bgColor = document.getElementById('bgColor').value;
    const diameter = parseInt(document.getElementById('diameter').value);
    const rotation = parseInt(document.getElementById('rotation').value);
    const radius = diameter / 2;
    const outerRingThickness = parseFloat(document.getElementById('outerRing').value);
    const middleRingThickness = parseFloat(document.getElementById('middleRing').value);
    const innerRingThickness = parseFloat(document.getElementById('innerRing').value);
    const ringSpacing = parseInt(document.getElementById('ringSpacing').value);
    const ringOffsetX = parseInt(document.getElementById('ringOffsetX').value);
    const ringOffsetY = parseInt(document.getElementById('ringOffsetY').value);
    const showStars = document.getElementById('showStars').checked;

    // Circle style options
    const borderStyle = document.querySelector('input[name="borderStyle"]:checked').value;
    const circleType = document.querySelector('input[name="circleType"]:checked').value;
    const cornerStyle = document.querySelector('input[name="cornerStyle"]:checked').value;
    const dashPattern = parseInt(document.getElementById('dashPattern').value);
    const dashGap = parseInt(document.getElementById('dashGap').value);
    const ringShadow = document.getElementById('ringShadow').checked;
    const shadowBlur = parseInt(document.getElementById('shadowBlur').value);
    const shadowOffsetX = parseInt(document.getElementById('shadowOffsetX').value);
    const shadowOffsetY = parseInt(document.getElementById('shadowOffsetY').value);

    // Clear canvas with background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);

    // Set shadow if enabled
    if (ringShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
    }

    // Set corner style
    ctx.lineCap = cornerStyle;

    // Draw rings based on type
    ctx.strokeStyle = currentColor;

    if (circleType === 'normal' || circleType === 'double' || circleType === 'triple') {
        // Outer ring
        ctx.lineWidth = outerRingThickness;
        setLineStyle(borderStyle, dashPattern, dashGap);
        ctx.beginPath();
        ctx.arc(centerX + ringOffsetX, centerY + ringOffsetY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Middle ring for triple
        if (circleType === 'triple') {
            ctx.lineWidth = middleRingThickness;
            setLineStyle(borderStyle, dashPattern, dashGap);
            ctx.beginPath();
            ctx.arc(centerX + ringOffsetX, centerY + ringOffsetY, radius - ringSpacing / 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Inner ring
        ctx.lineWidth = innerRingThickness;
        setLineStyle(borderStyle, dashPattern, dashGap);
        ctx.beginPath();
        ctx.arc(centerX + ringOffsetX, centerY + ringOffsetY, radius - ringSpacing, 0, Math.PI * 2);
        ctx.stroke();

        // Double circle effect (second outer ring)
        if (circleType === 'double') {
            ctx.lineWidth = outerRingThickness / 2;
            setLineStyle(borderStyle, dashPattern, dashGap);
            ctx.beginPath();
            ctx.arc(centerX + ringOffsetX, centerY + ringOffsetY, radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else if (circleType === 'dotted') {
        // Dotted circle
        ctx.setLineDash([1, dashGap]);
        ctx.lineWidth = outerRingThickness;
        for (let i = 0; i < 360; i += dashGap * 2) {
            ctx.beginPath();
            ctx.arc(centerX + ringOffsetX + (radius * Math.cos(i * Math.PI / 180)),
                centerY + ringOffsetY + (radius * Math.sin(i * Math.PI / 180)),
                outerRingThickness / 2, 0, Math.PI * 2);
            ctx.fillStyle = currentColor;
            ctx.fill();
        }
    }

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.setLineDash([]);
    ctx.restore();

    // Get text values
    const centerName = document.getElementById('centerName').value;
    const ownerName = document.getElementById('ownerName').value;
    const branchAddress = document.getElementById('branchAddress').value;
    const idCode = document.getElementById('idCode').value;
    const extraText = document.getElementById('extraText').value;
    const bottomText = document.getElementById('bottomText').value;

    // Top curved text
    const topFontFamily = document.getElementById('topFontFamily').value;
    const topFontSize = parseInt(document.getElementById('topFontSize').value);
    const topRadius = parseInt(document.getElementById('topRadius').value);
    const topStartAngle = parseInt(document.getElementById('topStartAngle').value);
    const topEndAngle = parseInt(document.getElementById('topEndAngle').value);
    const topBold = document.getElementById('topBold').checked;
    const topItalic = document.getElementById('topItalic').checked;
    const topUnderline = document.getElementById('topUnderline').checked;

    drawCurvedText(centerName, centerX, centerY, topRadius, topStartAngle, topEndAngle,
        topFontSize, topFontFamily, topBold, topItalic, topUnderline);

    // Bottom curved text
    const bottomFontFamily = document.getElementById('bottomFontFamily').value;
    const bottomFontSize = parseInt(document.getElementById('bottomFontSize').value);
    const bottomRadius = parseInt(document.getElementById('bottomRadius').value);
    const bottomStartAngle = parseInt(document.getElementById('bottomStartAngle').value);
    const bottomEndAngle = parseInt(document.getElementById('bottomEndAngle').value);
    const bottomBold = document.getElementById('bottomBold').checked;
    const bottomItalic = document.getElementById('bottomItalic').checked;
    const bottomUnderline = document.getElementById('bottomUnderline').checked;

    drawCurvedText(bottomText, centerX, centerY, bottomRadius, bottomStartAngle, bottomEndAngle,
        bottomFontSize, bottomFontFamily, bottomBold, bottomItalic, bottomUnderline);

    // Draw stars
    if (showStars) {
        const starStyle = parseInt(document.querySelector('input[name="starStyle"]:checked').value);
        const leftStarSize = parseInt(document.getElementById('leftStarSize').value);
        const leftStarX = centerX + parseInt(document.getElementById('leftStarX').value);
        const leftStarY = centerY + parseInt(document.getElementById('leftStarY').value);
        const rightStarSize = parseInt(document.getElementById('rightStarSize').value);
        const rightStarX = centerX + parseInt(document.getElementById('rightStarX').value);
        const rightStarY = centerY + parseInt(document.getElementById('rightStarY').value);

        drawStar(leftStarX, leftStarY, starStyle, leftStarSize / 2, leftStarSize / 4, currentColor);
        drawStar(rightStarX, rightStarY, starStyle, rightStarSize / 2, rightStarSize / 4, currentColor);
    }

    // Draw lines
    if (document.getElementById('enableLine1').checked) {
        const line1Length = parseInt(document.getElementById('line1Length').value);
        const line1Thickness = parseFloat(document.getElementById('line1Thickness').value);
        const line1X = parseInt(document.getElementById('line1X').value);
        const line1Y = parseInt(document.getElementById('line1Y').value);
        const line1Rotation = parseInt(document.getElementById('line1Rotation').value);
        const line1Type = document.querySelector('input[name="line1Type"]:checked').value;
        const line1Dashed = document.getElementById('line1Dashed').checked;

        drawLine(centerX, centerY, line1Length, line1Thickness, line1X, line1Y,
            line1Rotation, line1Type === 'double', line1Dashed, currentColor);
    }

    if (document.getElementById('enableLine2').checked) {
        const line2Length = parseInt(document.getElementById('line2Length').value);
        const line2Thickness = parseFloat(document.getElementById('line2Thickness').value);
        const line2X = parseInt(document.getElementById('line2X').value);
        const line2Y = parseInt(document.getElementById('line2Y').value);
        const line2Rotation = parseInt(document.getElementById('line2Rotation').value);
        const line2Type = document.querySelector('input[name="line2Type"]:checked').value;
        const line2Dashed = document.getElementById('line2Dashed').checked;

        drawLine(centerX, centerY, line2Length, line2Thickness, line2X, line2Y,
            line2Rotation, line2Type === 'double', line2Dashed, currentColor);
    }

    // Draw sign
    if (document.getElementById('enableSign').checked && signImage) {
        const signWidth = parseInt(document.getElementById('signWidth').value);
        const signHeight = parseInt(document.getElementById('signHeight').value);
        const signX = centerX + parseInt(document.getElementById('signX').value);
        const signY = centerY + parseInt(document.getElementById('signY').value);
        const signRotation = parseInt(document.getElementById('signRotation').value);
        const signOpacity = parseFloat(document.getElementById('signOpacity').value);

        ctx.save();
        ctx.translate(signX, signY);
        ctx.rotate(signRotation * Math.PI / 180);
        ctx.globalAlpha = signOpacity;
        ctx.drawImage(signImage, -signWidth / 2, -signHeight / 2, signWidth, signHeight);
        ctx.restore();
    }

    // Draw center text lines
    ctx.save();

    // Line 1 (Owner)
    const center1Size = parseInt(document.getElementById('center1Size').value);
    const center1X = centerX + parseInt(document.getElementById('center1X').value);
    const center1Y = centerY + parseInt(document.getElementById('center1Y').value);
    const center1Bold = document.getElementById('center1Bold').checked;
    const center1Italic = document.getElementById('center1Italic').checked;

    ctx.font = getFontStyle(center1Bold, center1Italic, false, center1Size, 'Arial');
    ctx.fillStyle = currentColor;
    ctx.fillText(ownerName, center1X, center1Y);

    // Line 2 (Address)
    const center2Size = parseInt(document.getElementById('center2Size').value);
    const center2X = centerX + parseInt(document.getElementById('center2X').value);
    const center2Y = centerY + parseInt(document.getElementById('center2Y').value);
    const center2Bold = document.getElementById('center2Bold').checked;
    const center2Italic = document.getElementById('center2Italic').checked;

    ctx.font = getFontStyle(center2Bold, center2Italic, false, center2Size, 'Arial');
    ctx.fillText(branchAddress, center2X, center2Y);

    // Line 3 (ID + Extra)
    const center3Size = parseInt(document.getElementById('center3Size').value);
    const center3X = centerX + parseInt(document.getElementById('center3X').value);
    const center3Y = centerY + parseInt(document.getElementById('center3Y').value);
    const center3Bold = document.getElementById('center3Bold').checked;
    const center3Italic = document.getElementById('center3Italic').checked;

    ctx.font = getFontStyle(center3Bold, center3Italic, false, center3Size, 'Arial');
    ctx.fillText(idCode + ' ' + extraText, center3X, center3Y);

    ctx.restore();

    // Draw shape/logo
    drawShape();
}

// Event listeners for all inputs
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', () => {
        drawStamp();
        updateAllValues();
    });
});

// Radio button listeners
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', drawStamp);
});

// Enable/disable shape controls
document.getElementById('enableLogo').addEventListener('change', function (e) {
    document.getElementById('shapeControls').style.display = e.target.checked ? 'block' : 'none';
    drawStamp();
});

// Enable/disable sign controls
document.getElementById('enableSign').addEventListener('change', function (e) {
    document.getElementById('signControls').style.display = e.target.checked ? 'block' : 'none';
    drawStamp();
});

// Enable/disable line controls
document.getElementById('enableLine1').addEventListener('change', function (e) {
    document.getElementById('line1Controls').style.display = e.target.checked ? 'block' : 'none';
    drawStamp();
});

document.getElementById('enableLine2').addEventListener('change', function (e) {
    document.getElementById('line2Controls').style.display = e.target.checked ? 'block' : 'none';
    drawStamp();
});

// Reset to defaults
function resetDefaults() {
    // Basic info
    document.getElementById('centerName').value = 'CSC CENTER';
    document.getElementById('ownerName').value = 'RAJESH KUMAR';
    document.getElementById('branchAddress').value = 'MAIN BRANCH, DELHI';
    document.getElementById('idCode').value = 'CSC123456';
    document.getElementById('extraText').value = 'AUTHORIZED CENTER';
    document.getElementById('bottomText').value = 'INDIA';

    // Dimensions
    document.getElementById('diameter').value = '400';
    document.getElementById('rotation').value = '0';

    // Rings
    document.getElementById('outerRing').value = '4';
    document.getElementById('middleRing').value = '3';
    document.getElementById('innerRing').value = '2';
    document.getElementById('ringSpacing').value = '10';

    // Circle style
    document.getElementById('borderSolid').checked = true;
    document.getElementById('circleNormal').checked = true;
    document.getElementById('cornerRound').checked = true;

    // Top text
    document.getElementById('topBold').checked = true;
    document.getElementById('topItalic').checked = false;
    document.getElementById('topUnderline').checked = false;
    document.getElementById('topFontSize').value = '24';
    document.getElementById('topRadius').value = '180';
    document.getElementById('topStartAngle').value = '135';
    document.getElementById('topEndAngle').value = '225';

    // Bottom text
    document.getElementById('bottomBold').checked = false;
    document.getElementById('bottomItalic').checked = false;
    document.getElementById('bottomUnderline').checked = false;
    document.getElementById('bottomFontSize').value = '20';
    document.getElementById('bottomRadius').value = '180';
    document.getElementById('bottomStartAngle').value = '315';
    document.getElementById('bottomEndAngle').value = '45';

    // Center text
    document.getElementById('center1Bold').checked = true;
    document.getElementById('center1Size').value = '20';
    document.getElementById('center2Size').value = '16';
    document.getElementById('center3Size').value = '16';

    // Stars
    document.getElementById('showStars').checked = true;
    document.getElementById('star5').checked = true;
    document.getElementById('leftStarSize').value = '15';
    document.getElementById('rightStarSize').value = '15';

    // Lines - disable by default
    document.getElementById('enableLine1').checked = false;
    document.getElementById('enableLine2').checked = false;

    // Sign - disable by default
    document.getElementById('enableSign').checked = false;

    setColor('black');
    drawStamp();
    updateAllValues();
}

// Save preset to localStorage
function savePreset() {
    const preset = {};
    document.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.id) {
            if (element.type === 'checkbox') {
                preset[element.id] = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) {
                    preset[element.name] = element.value;
                }
            } else {
                preset[element.id] = element.value;
            }
        }
    });
    localStorage.setItem('stampPreset', JSON.stringify(preset));
    alert('Preset saved!');
}

// Load preset from localStorage
function loadPreset() {
    const preset = JSON.parse(localStorage.getItem('stampPreset'));
    if (preset) {
        Object.keys(preset).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = preset[id];
                } else if (element.type === 'radio') {
                    const radio = document.querySelector(`input[name="${id}"][value="${preset[id]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = preset[id];
                }
            }
        });
        drawStamp();
        updateAllValues();
        alert('Preset loaded!');
    }
}

// Download as PNG
function downloadPNG() {
    const canvas = document.getElementById('stampCanvas');
    const link = document.createElement('a');
    link.download = `csc-stamp-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Download as PDF
function downloadPDF() {
    const canvas = document.getElementById('stampCanvas');
    const canvasData = canvas.toDataURL('image/png');

    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
                <html>
                    <head>
                        <title>CSC Stamp PDF</title>
                        <style>
                            body { display: flex; justify-content: center; align-items: center; height: 100vh; }
                            img { max-width: 100%; }
                        </style>
                    </head>
                    <body>
                        <img src="${canvasData}" style="width: 400px;">
                        <script>
                            setTimeout(() => window.print(), 1000);
                        <\/script>
                    </body>
                </html>
            `);
}

// Generate print layout
function generatePrintLayout() {
    const copyCount = parseInt(document.getElementById('copyCount').value);
    const preview = document.getElementById('printPreview');

    preview.innerHTML = '';

    for (let i = 0; i < copyCount; i++) {
        const stampDiv = document.createElement('div');
        stampDiv.className = 'print-stamp';

        const miniCanvas = document.createElement('canvas');
        miniCanvas.width = 150;
        miniCanvas.height = 150;

        const ctx = miniCanvas.getContext('2d');
        ctx.drawImage(document.getElementById('stampCanvas'), 0, 0, 150, 150);

        stampDiv.appendChild(miniCanvas);
        preview.appendChild(stampDiv);
    }
}

// Print layout
function printLayout() {
    const printContent = document.getElementById('printPreview').innerHTML;
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Stamps</title>
                        <style>
                            body { margin: 20px; }
                            .print-preview {
                                display: grid;
                                grid-template-columns: repeat(4, 1fr);
                                gap: 10px;
                            }
                            .print-stamp {
                                page-break-inside: avoid;
                                border: 1px solid #ddd;
                                padding: 5px;
                            }
                            canvas { width: 100%; height: auto; }
                        </style>
                    </head>
                    <body>
                        <div class="print-preview">
                            ${printContent}
                        </div>
                        <script>
                            window.print();
                            window.onafterprint = () => window.close();
                        <\/script>
                    </body>
                </html>
            `);
}

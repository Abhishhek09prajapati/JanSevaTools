
let currentTemplate = 't1';
let students = [];

// Default Images
let photoDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%2394a3b8'/%3E%3Cpath d='M20 100 Q50 60 80 100' fill='%2394a3b8'/%3E%3C/svg%3E";
let logoDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8' width='24' height='24'%3E%3Cpath d='M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z'/%3E%3C/svg%3E";
let signDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Cpath d='M10,20 Q30,5 50,20 T90,10' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E";

// 14 Templates Definitions
const templates = {
    // --- 7 VERTICAL TEMPLATES ---
    't1': `
            <div class="id-card vert-card t1-vert">
                <div class="header"><div class="school-name dyn-school"></div></div>
                <div class="body">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="student-name dyn-name"></div>
                    <table class="details-table">
                        <tr><td>Father</td><td>: <span class="dyn-father"></span></td></tr>
                        <tr><td>D.O.B</td><td>: <span class="dyn-dob"></span></td></tr>
                        <tr><td>Class</td><td>: <span class="dyn-class"></span></td></tr>
                        <tr><td>Roll No</td><td>: <span class="dyn-roll"></span></td></tr>
                        <tr><td>Phone</td><td>: <span class="dyn-phone"></span></td></tr>
                    </table>
                </div>
                <div class="sign-area"><img src="" class="sign-frame dyn-sign"><div style="font-size: 6px; font-weight: bold;">Principal</div></div>
                <div class="footer dyn-address"></div>
            </div>`,
    't2': `
            <div class="id-card vert-card t2-vert">
                <div class="header-bg"></div>
                <div class="content">
                    <div class="header-text"><img src="" class="logo logo-frame dyn-logo"><div class="school-name dyn-school"></div></div>
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="student-name dyn-name"></div>
                    <div class="details">
                        <div><span>ROLL NO.</span><span>: <span class="dyn-roll"></span></span></div>
                        <div><span>FATHER</span><span>: <span class="dyn-father"></span></span></div>
                        <div><span>D.O.B</span><span>: <span class="dyn-dob"></span></span></div>
                        <div><span>CLASS</span><span>: <span class="dyn-class"></span></span></div>
                        <div><span>PHONE</span><span>: <span class="dyn-phone"></span></span></div>
                    </div>
                    <div class="footer"><div><span class="dyn-bg" style="color:red; font-weight:bold;"></span></div><div style="text-align: right;"><img src="" class="sign-frame dyn-sign"><br><span style="font-weight:bold;">Principal Sign</span></div></div>
                </div>
            </div>`,
    't5': `
            <div class="id-card vert-card t5-vert">
                <div class="top-half">
                    <img src="" class="logo logo-frame dyn-logo" style="width:25px; height:25px; background:white; border-radius:50%; padding:2px;">
                    <div class="school-name dyn-school"></div>
                </div>
                <img src="" class="photo photo-frame dyn-photo">
                <div class="bottom-half">
                    <div class="student-name dyn-name"></div>
                    <div style="font-size:10px; color:#555; font-weight:bold; margin-bottom:5px;">Class: <span class="dyn-class"></span> | Roll: <span class="dyn-roll"></span></div>
                    <div class="details">
                        <p><strong>F. Name:</strong> <span class="dyn-father"></span></p>
                        <p><strong>D.O.B:</strong> <span class="dyn-dob"></span> | <strong>B.G:</strong> <span class="dyn-bg"></span></p>
                        <p><strong>Mob:</strong> <span class="dyn-phone"></span></p>
                    </div>
                </div>
                <div class="footer"><span>Add: <span class="dyn-address"></span></span> <img src="" class="sign-frame dyn-sign" style="filter: brightness(0) invert(1); max-height:15px;"></div>
            </div>`,
    't6': `
            <div class="id-card vert-card t6-vert">
                <div class="header"><img src="" class="logo logo-frame dyn-logo"><div class="school-name dyn-school"></div></div>
                <div class="main-content">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="info">
                        <div class="student-name dyn-name"></div>
                        <table class="details-table">
                            <tr><td>Cls</td><td>: <span class="dyn-class"></span></td></tr>
                            <tr><td>Roll</td><td>: <span class="dyn-roll"></span></td></tr>
                            <tr><td>DOB</td><td>: <span class="dyn-dob"></span></td></tr>
                            <tr><td>Fath</td><td>: <span class="dyn-father"></span></td></tr>
                            <tr><td>Ph</td><td>: <span class="dyn-phone"></span></td></tr>
                        </table>
                    </div>
                </div>
                <div style="font-size:8px; margin-top:10px;"><strong>Add:</strong> <span class="dyn-address"></span></div>
                <div class="bottom"><img src="" class="sign-frame dyn-sign"><br>Principal</div>
            </div>`,
    't7': `
            <div class="id-card vert-card t7-vert">
                <div class="inner">
                    <div class="school-name dyn-school"></div>
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="student-name dyn-name"></div>
                    <div class="details">
                        Class: <span class="dyn-class"></span> | Roll: <span class="dyn-roll"></span><br>
                        F: <span class="dyn-father"></span><br>
                        DOB: <span class="dyn-dob"></span> | BG: <span class="dyn-bg"></span><br>
                        Ph: <span class="dyn-phone"></span><br>
                        <span class="dyn-address" style="font-size:7px;"></span>
                    </div>
                    <div class="sign-area"><img src="" class="sign-frame dyn-sign" style="filter: brightness(0) invert(1);"><br>Auth Signatory</div>
                </div>
            </div>`,
    't8': `
            <div class="id-card vert-card t8-vert">
                <div class="header"><img src="" class="logo logo-frame dyn-logo" style="width:25px; height:25px;"><div class="school-name dyn-school"></div></div>
                <div class="body">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="details-card">
                        <div class="student-name dyn-name"></div>
                        <div><strong>C:</strong> <span class="dyn-class"></span> | <strong>R:</strong> <span class="dyn-roll"></span></div>
                        <div><strong>F:</strong> <span class="dyn-father"></span></div>
                        <div><strong>D:</strong> <span class="dyn-dob"></span> | <strong>BG:</strong> <span class="dyn-bg"></span></div>
                        <div><strong>P:</strong> <span class="dyn-phone"></span></div>
                    </div>
                </div>
                <div style="position:absolute; bottom:10px; right:15px; text-align:center;"><img src="" class="sign-frame dyn-sign"><br><span style="font-size:7px;">Principal</span></div>
            </div>`,
    't9': `
            <div class="id-card vert-card t9-vert">
                <div class="top-bar"></div>
                <div class="header"><img src="" class="logo logo-frame dyn-logo"><div class="school-name dyn-school"></div></div>
                <div class="id-title">STUDENT IDENTITY CARD</div>
                <div class="photo-sec"><img src="" class="photo photo-frame dyn-photo"></div>
                <div class="details" style="text-align:center;">
                    <div style="font-size:14px; font-weight:800; color:var(--card-secondary);" class="dyn-name"></div>
                    <div style="margin-bottom:5px; font-weight:bold;">Class: <span class="dyn-class"></span></div>
                    <span>Father: <span class="dyn-father"></span></span>
                    <span>DOB: <span class="dyn-dob"></span> | Roll: <span class="dyn-roll"></span></span>
                    <span>Ph: <span class="dyn-phone"></span></span>
                </div>
                <div class="footer">Add: <span class="dyn-address"></span></div>
            </div>`,

    // --- 7 HORIZONTAL TEMPLATES ---
    't3': `
            <div class="id-card horiz-card t3-horiz">
                <div class="header"><img src="" class="logo logo-frame dyn-logo"><div class="school-name dyn-school"></div></div>
                <div class="body">
                    <div class="left-col"><img src="" class="photo photo-frame dyn-photo"><div class="roll">No. <span class="dyn-roll"></span></div></div>
                    <div class="right-col">
                        <div style="font-size: 14px; font-weight:bold; margin-bottom: 5px; color: var(--card-secondary);">Name: <span class="dyn-name" style="color:#000;"></span></div>
                        <table class="details-table">
                            <tr><td>Class/Sec</td><td>: <span class="dyn-class"></span></td></tr>
                            <tr><td>Father's</td><td>: <span class="dyn-father"></span></td></tr>
                            <tr><td>D.O.B</td><td>: <span class="dyn-dob"></span></td></tr>
                            <tr><td>Blood Grp</td><td>: <span class="dyn-bg"></span></td></tr>
                            <tr><td>Mobile</td><td>: <span class="dyn-phone"></span></td></tr>
                        </table>
                    </div>
                </div>
                <div class="sign-area"><img src="" class="sign-frame dyn-sign"><div style="font-size: 7px; font-weight: bold; color:var(--card-secondary);">Principal</div></div>
                <div class="footer dyn-address"></div>
            </div>`,
    't4': `
            <div class="id-card horiz-card t4-horiz">
                <div class="header"><img src="" class="logo logo-frame dyn-logo"><div class="school-name dyn-school"></div></div>
                <div class="name-ribbon dyn-name"></div>
                <div class="body">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="details">
                        <span>Father</span> <span>: <span class="dyn-father"></span></span>
                        <span>Mother</span> <span>: <span class="dyn-mother"></span></span>
                        <span>Class</span> <span>: <span class="dyn-class"></span></span>
                        <span>D.O.B.</span> <span>: <span class="dyn-dob"></span></span>
                        <span>Roll No.</span> <span>: <span class="dyn-roll"></span></span>
                        <span>Mob</span> <span>: <span class="dyn-phone"></span></span>
                    </div>
                </div>
                <div class="footer-graphic"><img src="" class="sign-frame dyn-sign" style="filter: brightness(0) invert(1);"> </div>
            </div>`,
    't10': `
            <div class="id-card horiz-card t10-horiz">
                <div class="sidebar">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="roll-bg">ID: <span class="dyn-roll"></span></div>
                    <div style="font-size:8px; margin-top:10px; text-align:center;">BG: <span class="dyn-bg" style="font-weight:bold; font-size:10px;"></span></div>
                </div>
                <div class="main-area">
                    <div class="school-name dyn-school"></div>
                    <div class="student-name dyn-name"></div>
                    <div class="details">
                        <p><span>Class:</span> <span class="dyn-class" style="color:#000;"></span></p>
                        <p><span>Father:</span> <span class="dyn-father" style="color:#000;"></span></p>
                        <p><span>DOB:</span> <span class="dyn-dob" style="color:#000;"></span></p>
                        <p><span>Phone:</span> <span class="dyn-phone" style="color:#000;"></span></p>
                        <p style="margin-top:4px;"><span>Add:</span> <span class="dyn-address" style="color:#000;"></span></p>
                    </div>
                    <div class="sign-area"><img src="" class="sign-frame dyn-sign"><br><span style="font-size:7px; font-weight:bold;">Principal</span></div>
                </div>
            </div>`,
    't11': `
            <div class="id-card horiz-card t11-horiz">
                <div class="top-accent"></div>
                <div class="header"><img src="" class="logo logo-frame dyn-logo" style="width:30px;"><div class="school-name dyn-school"></div></div>
                <div class="content-wrap">
                    <div class="info-sec">
                        <div class="student-name dyn-name"></div>
                        <div class="details-grid">
                            <div><strong>Class:</strong> <span class="dyn-class"></span></div>
                            <div><strong>Roll:</strong> <span class="dyn-roll"></span></div>
                            <div><strong>Fath:</strong> <span class="dyn-father"></span></div>
                            <div><strong>DOB:</strong> <span class="dyn-dob"></span></div>
                            <div style="grid-column: span 2;"><strong>Mob:</strong> <span class="dyn-phone"></span></div>
                        </div>
                    </div>
                    <div class="photo-sec"><img src="" class="photo photo-frame dyn-photo"></div>
                </div>
                <div class="footer"><div><span class="dyn-address"></span></div> <div><img src="" class="sign-frame dyn-sign" style="max-height:15px;"></div></div>
            </div>`,
    't12': `
            <div class="id-card horiz-card t12-horiz">
                <div class="inner-border">
                    <div class="header"><img src="" class="logo logo-frame dyn-logo" style="width:25px;"><div class="school-name dyn-school" style="color:var(--card-primary);"></div></div>
                    <div class="body-area">
                        <img src="" class="photo photo-frame dyn-photo">
                        <div class="details">
                            <div style="font-size:13px; font-weight:800; margin-bottom:5px;" class="dyn-name"></div>
                            <table>
                                <tr><td>Class / Sec</td><td>: <span class="dyn-class"></span></td></tr>
                                <tr><td>Roll No.</td><td>: <span class="dyn-roll"></span></td></tr>
                                <tr><td>Father Name</td><td>: <span class="dyn-father"></span></td></tr>
                                <tr><td>Date of Birth</td><td>: <span class="dyn-dob"></span></td></tr>
                                <tr><td>Contact</td><td>: <span class="dyn-phone"></span></td></tr>
                            </table>
                        </div>
                    </div>
                    <div style="position:absolute; bottom:15px; right:20px; text-align:center;"><img src="" class="sign-frame dyn-sign" style="max-height:20px;"><br><span style="font-size:7px; font-weight:bold;">Headmaster</span></div>
                </div>
            </div>`,
    't13': `
            <div class="id-card horiz-card t13-horiz">
                <div class="header"><img src="" class="logo logo-frame dyn-logo" style="width:30px; background:white; border-radius:50%; padding:2px;"><div class="school-name dyn-school"></div></div>
                <div class="body">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="info-list">
                        <div class="student-name dyn-name"></div>
                        <div><strong>Cls:</strong> <span class="dyn-class"></span> | <strong>Roll:</strong> <span class="dyn-roll"></span></div>
                        <div><strong>F:</strong> <span class="dyn-father"></span></div>
                        <div><strong>DOB:</strong> <span class="dyn-dob"></span> | <strong>BG:</strong> <span class="dyn-bg"></span></div>
                        <div><strong>Mob:</strong> <span class="dyn-phone"></span></div>
                    </div>
                </div>
                <div class="bottom-bar">Valid for Year 2026-27</div>
                <div style="position:absolute; bottom:5px; right:15px;"><img src="" class="sign-frame dyn-sign" style="max-height:20px;"></div>
            </div>`,
    't14': `
            <div class="id-card horiz-card t14-horiz">
                <div class="top-row"><img src="" class="logo logo-frame dyn-logo"><div class="school-name dyn-school"></div></div>
                <div class="mid-row">
                    <img src="" class="photo photo-frame dyn-photo">
                    <div class="details-wrap">
                        <div class="student-name dyn-name"></div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:3px;"><span>Class: <span class="dyn-class" style="font-weight:bold;"></span></span> <span>Roll: <span class="dyn-roll" style="font-weight:bold;"></span></span></div>
                        <div style="margin-bottom:3px;">Father: <span class="dyn-father"></span></div>
                        <div style="margin-bottom:3px;">DOB: <span class="dyn-dob"></span></div>
                        <div>Mob: <span class="dyn-phone"></span></div>
                    </div>
                </div>
                <div style="position:absolute; bottom:5px; right:15px;"><img src="" class="sign-frame dyn-sign" style="max-height:18px;"></div>
                <div style="position:absolute; bottom:5px; left:15px; font-size:7px; color:#888;">Add: <span class="dyn-address"></span></div>
            </div>`
};

function updatePreview() {
    const data = getFormData();
    const container = document.getElementById('render-card');

    const setVal = (cls, val) => {
        container.querySelectorAll('.' + cls).forEach(el => {
            if (el.tagName === 'IMG') el.src = val;
            else el.innerText = val;
        });
    };

    setVal('dyn-school', data.school);
    setVal('dyn-name', data.name);
    setVal('dyn-class', data.cls);
    setVal('dyn-roll', data.roll);
    setVal('dyn-father', data.father);
    setVal('dyn-mother', data.mother);
    setVal('dyn-dob', data.dob);
    setVal('dyn-bg', data.bg);
    setVal('dyn-phone', data.phone);
    setVal('dyn-address', data.address);

    setVal('dyn-photo', photoDataUrl);
    setVal('dyn-logo', logoDataUrl);
    setVal('dyn-sign', signDataUrl);

    container.querySelectorAll('.dyn-photo').forEach(el => {
        if (data.showBorder) el.classList.add('custom-border');
        else el.classList.remove('custom-border');
    });
}

function getFormData() {
    return {
        school: document.getElementById('inp-school').value,
        name: document.getElementById('inp-name').value,
        cls: document.getElementById('inp-class').value,
        roll: document.getElementById('inp-roll').value,
        father: document.getElementById('inp-father').value,
        mother: document.getElementById('inp-mother').value,
        dob: document.getElementById('inp-dob').value,
        bg: document.getElementById('inp-bg').value,
        phone: document.getElementById('inp-phone').value,
        address: document.getElementById('inp-address').value,
        showBorder: document.getElementById('inp-photo-border').checked
    };
}

function handleImage(event, type) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (type === 'preview-photo') photoDataUrl = e.target.result;
            if (type === 'preview-logo') logoDataUrl = e.target.result;
            if (type === 'preview-sign') signDataUrl = e.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

function selectTemplate(t_id, el) {
    currentTemplate = t_id;
    document.querySelectorAll('.template-option').forEach(btn => btn.classList.remove('active'));
    el.classList.add('active');

    document.getElementById('live-preview-container').innerHTML = templates[t_id];
    document.getElementById('live-preview-container').firstElementChild.id = 'render-card';
    updatePreview();
}

function updateColors() {
    const primary = document.getElementById('color-primary').value;
    const secondary = document.getElementById('color-secondary').value;
    document.documentElement.style.setProperty('--card-primary', primary);
    document.documentElement.style.setProperty('--card-secondary', secondary);
}

function addStudent() {
    const data = getFormData();
    if (!data.name) return alert("Please enter at least a student name.");

    const studentRecord = {
        id: Date.now(),
        template: currentTemplate,
        htmlString: templates[currentTemplate],
        data: data,
        photo: photoDataUrl,
        logo: logoDataUrl,
        sign: signDataUrl
    };

    students.push(studentRecord);
    renderStudentList();
}

function removeStudent(id) {
    students = students.filter(s => s.id !== id);
    renderStudentList();
}

function renderStudentList() {
    const ul = document.getElementById('student-list-ui');
    ul.innerHTML = '';
    document.getElementById('count').innerText = students.length;

    if (students.length === 0) {
        ul.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 0.85rem; margin-top: 20px;">No students added yet.<br>Fill details and click "+ Add to Print List"</div>`;
        return;
    }

    students.forEach(student => {
        const li = document.createElement('li');
        li.className = 'student-item';
        li.innerHTML = `
                <div>
                    <strong>${student.data.name}</strong><br>
                    <span style="color: #64748b; font-size: 0.75rem;">Class: ${student.data.cls} | Roll: ${student.data.roll}</span>
                </div>
                <button class="remove-btn" onclick="removeStudent(${student.id})" title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            `;
        ul.appendChild(li);
    });
}

function printCards() {
    if (students.length === 0) return alert("Please add at least one student to the print list first.");

    const printContainer = document.getElementById('print-container');
    const gridClass = document.getElementById('grid-layout').value;

    printContainer.className = gridClass;
    printContainer.innerHTML = '';

    students.forEach(student => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = student.htmlString;

        const setV = (cls, val) => {
            tempDiv.querySelectorAll('.' + cls).forEach(el => {
                if (el.tagName === 'IMG') el.src = val;
                else el.innerText = val;
            });
        };

        setV('dyn-school', student.data.school);
        setV('dyn-name', student.data.name);
        setV('dyn-class', student.data.cls);
        setV('dyn-roll', student.data.roll);
        setV('dyn-father', student.data.father);
        setV('dyn-mother', student.data.mother);
        setV('dyn-dob', student.data.dob);
        setV('dyn-bg', student.data.bg);
        setV('dyn-phone', student.data.phone);
        setV('dyn-address', student.data.address);

        setV('dyn-photo', student.photo);
        setV('dyn-logo', student.logo);
        setV('dyn-sign', student.sign);

        tempDiv.querySelectorAll('.dyn-photo').forEach(el => {
            if (student.data.showBorder) el.classList.add('custom-border');
            else el.classList.remove('custom-border');
        });

        printContainer.appendChild(tempDiv.firstElementChild);
    });

    setTimeout(() => {
        window.print();
    }, 300);
}

updatePreview();
updateColors();


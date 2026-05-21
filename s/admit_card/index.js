
let allCards = [];
let editingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadCards();
    attachEventListeners();
    checkStorageQuota();
});

// Load cards from local storage
function loadCards() {
    try {
        const saved = localStorage.getItem('admitCards');
        if (saved) {
            allCards = JSON.parse(saved);
        }
        renderCards(allCards);
        updateStats();
        updateStorageProgress();
    } catch (error) {
        showToast('Error loading cards', 'error');
        console.error(error);
    }
}

// Save cards to local storage
function saveCards() {
    try {
        localStorage.setItem('admitCards', JSON.stringify(allCards));
        updateStats();
        updateStorageProgress();
        showToast('Cards saved successfully', 'success');
    } catch (error) {
        showToast('Error saving cards', 'error');
        console.error(error);
    }
}

// Update storage progress
function updateStorageProgress() {
    try {
        const storageData = JSON.stringify(allCards);
        const sizeInBytes = new Blob([storageData]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        const quota = 5120; // 5MB limit approx
        const percentage = (sizeInBytes / (quota * 1024)) * 100;

        document.getElementById('storageProgress').style.width = Math.min(percentage, 100) + '%';
        document.getElementById('storageInfo').textContent = `Storage: ${sizeInKB} KB used`;

        if (percentage > 80) {
            document.getElementById('storageProgress').style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
        }
    } catch (error) {
        console.error('Error calculating storage:', error);
    }
}

// Check storage quota
function checkStorageQuota() {
    try {
        const testData = 'x'.repeat(1024 * 1024); // 1MB test
        localStorage.setItem('test', testData);
        localStorage.removeItem('test');
    } catch (error) {
        showToast('Local storage limit may be reached. Export your cards to save them.', 'warning');
    }
}

// Attach event listeners
function attachEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('keyup', function (e) {
        performSearch();
    });

    // Filter
    document.getElementById('filterStatus').addEventListener('change', function () {
        performSearch();
    });

    // Debounce search for performance
    let searchTimeout;
    function performSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const filterStatus = document.getElementById('filterStatus').value;

            const filtered = allCards.filter(card => {
                const matchesSearch = (card.studentName?.toLowerCase().includes(searchTerm) ||
                    card.rollNumber?.toLowerCase().includes(searchTerm) ||
                    card.examName?.toLowerCase().includes(searchTerm));
                const matchesStatus = filterStatus === '' || card.status === filterStatus;
                return matchesSearch && matchesStatus;
            });

            renderCards(filtered);
        }, 300);
    }
}

// Filter by status (from stats click)
function filterByStatus(status) {
    document.getElementById('filterStatus').value = status || '';
    performSearch();
}

// Open add modal
function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle mr-2"></i>Add New Card';
    document.getElementById('cardForm').reset();
    document.getElementById('cardModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('cardModal').classList.remove('active');
    document.body.style.overflow = '';
    editingId = null;
}

// Open edit modal
function openEditModal(id) {
    editingId = id;
    const card = allCards.find(c => c.id === id);
    if (card) {
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit mr-2"></i>Edit Card';
        document.getElementById('studentName').value = card.studentName || '';
        document.getElementById('rollNumber').value = card.rollNumber || '';
        document.getElementById('examName').value = card.examName || '';
        document.getElementById('examDate').value = card.examDate || '';
        document.getElementById('examTime').value = card.examTime || '';
        document.getElementById('center').value = card.center || '';
        document.getElementById('room').value = card.room || '';
        document.getElementById('status').value = card.status || 'Active';
        document.getElementById('notes').value = card.notes || '';
        document.getElementById('cardModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    const studentName = document.getElementById('studentName').value.trim();
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const examName = document.getElementById('examName').value.trim();

    if (!studentName || !rollNumber || !examName) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    const cardData = {
        studentName: studentName,
        rollNumber: rollNumber,
        examName: examName,
        examDate: document.getElementById('examDate').value,
        examTime: document.getElementById('examTime').value,
        center: document.getElementById('center').value,
        room: document.getElementById('room').value,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value,
        lastUpdated: new Date().toISOString()
    };

    if (editingId) {
        // Update existing card
        const index = allCards.findIndex(c => c.id === editingId);
        if (index > -1) {
            allCards[index] = { ...allCards[index], ...cardData };
            showToast('Card updated successfully', 'success');
        }
    } else {
        // Add new card
        cardData.id = Date.now().toString();
        cardData.createdAt = new Date().toISOString();
        allCards.unshift(cardData);
        showToast('Card added successfully', 'success');
    }

    saveCards();
    renderCards(allCards);
    closeModal();
}

// Delete card
function deleteCard(id) {
    if (confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
        allCards = allCards.filter(c => c.id !== id);
        saveCards();
        renderCards(allCards);
        showToast('Card deleted successfully', 'success');
    }
}

// Download single card
function downloadCard(id) {
    const card = allCards.find(c => c.id === id);
    if (card) {
        const text = generateCardText(card);
        downloadFile(text, `admit-card-${card.rollNumber}.txt`);
        showToast('Card downloaded successfully', 'success');
    }
}

// Export all cards
function exportAllCards() {
    if (allCards.length === 0) {
        showToast('No cards to export', 'warning');
        return;
    }

    let allText = 'ADMIT CARDS EXPORT\n';
    allText += '='.repeat(50) + '\n\n';

    allCards.forEach((card, index) => {
        allText += `CARD #${index + 1}\n`;
        allText += '-'.repeat(30) + '\n';
        allText += generateCardText(card);
        allText += '\n' + '='.repeat(50) + '\n\n';
    });

    downloadFile(allText, `all-admit-cards-${new Date().toISOString().slice(0, 10)}.txt`);
    showToast('All cards exported successfully', 'success');
}

// Generate card text
function generateCardText(card) {
    return `
ADMIT CARD
================================
Name: ${card.studentName}
Roll Number: ${card.rollNumber}
Exam: ${card.examName}
Date: ${card.examDate}
Time: ${card.examTime}
Center: ${card.center}
Room: ${card.room}
Status: ${card.status}
${card.notes ? `Notes: ${card.notes}` : ''}
================================
Generated: ${new Date().toLocaleString()}
            `;
}

// Download file
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Render cards
function renderCards(cards) {
    const grid = document.getElementById('cardsGrid');

    if (!cards || cards.length === 0) {
        grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📋</div>
                        <h3>No Admit Cards Found</h3>
                        <p>Click the "Add New Card" button to create your first admit card.</p>
                        <button class="btn btn-primary mt-4" onclick="openAddModal()">
                            <i class="fas fa-plus-circle mr-2"></i> Create First Card
                        </button>
                    </div>
                `;
        return;
    }

    grid.innerHTML = cards.map((card, index) => `
                <div class="admit-card" style="animation-delay: ${index * 0.1}s">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-id-card"></i>
                            ${escapeHtml(card.studentName)}
                        </div>
                        <div class="status-badge status-${card.status}">${card.status}</div>
                    </div>
                    <div class="card-body">
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-hashtag"></i>Roll Number</span>
                            <span class="card-info-value">${escapeHtml(card.rollNumber)}</span>
                        </div>
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-book"></i>Exam</span>
                            <span class="card-info-value">${escapeHtml(card.examName)}</span>
                        </div>
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-calendar"></i>Date</span>
                            <span class="card-info-value">${formatDate(card.examDate)}</span>
                        </div>
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-clock"></i>Time</span>
                            <span class="card-info-value">${formatTime(card.examTime)}</span>
                        </div>
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-map-marker-alt"></i>Center</span>
                            <span class="card-info-value">${escapeHtml(card.center)}</span>
                        </div>
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-door-open"></i>Room</span>
                            <span class="card-info-value">${escapeHtml(card.room)}</span>
                        </div>
                        ${card.notes ? `
                        <div class="card-info">
                            <span class="card-info-label"><i class="fas fa-sticky-note"></i>Notes</span>
                            <span class="card-info-value">${escapeHtml(card.notes)}</span>
                        </div>
                        ` : ''}
                        <div class="card-actions">
                            <button class="btn-edit" onclick="openEditModal('${card.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-download" onclick="downloadCard('${card.id}')">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button class="btn-delete" onclick="deleteCard('${card.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
}

// Format time
function formatTime(timeString) {
    if (!timeString) return 'Not set';
    try {
        return timeString;
    } catch {
        return timeString;
    }
}

// Update statistics
function updateStats() {
    const total = allCards.length;
    const active = allCards.filter(c => c.status === 'Active').length;
    const pending = allCards.filter(c => c.status === 'Pending').length;
    const expired = allCards.filter(c => c.status === 'Expired').length;

    document.getElementById('totalStats').textContent = total;
    document.getElementById('activeStats').textContent = active;
    document.getElementById('pendingStats').textContent = pending;
    document.getElementById('expiredStats').textContent = expired;
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease forwards';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Share functions
function shareOnWhatsApp() {
    const text = 'Check out this free Admit Card Manager - Create and manage exam admit cards online';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}

function shareOnFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareOnTwitter() {
    const text = 'Free Admit Card Manager - Create exam hall tickets online';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('cardModal').classList.contains('active')) {
        closeModal();
    }
});

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function () {
        // Tooltip handled by CSS
    });
});

// Update last updated time periodically
setInterval(() => {
    if (allCards.length > 0) {
        // Just to keep the UI fresh if needed
    }
}, 60000);

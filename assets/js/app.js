document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const billForm = document.getElementById('bill-form');
    const dayInput = document.getElementById('day');
    const timeInput = document.getElementById('time');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const transportInput = document.getElementById('transport');
    const amountInput = document.getElementById('amount');
    const companyNameInput = document.getElementById('company-name');

    // Table elements
    const tableBody = document.getElementById('bill-table-body');
    const totalAmountCell = document.getElementById('total-amount');

    // Action buttons
    const downloadCsvBtn = document.getElementById('download-csv');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const finalizeDayBtn = document.getElementById('finalize-day');

    // Alert Modal elements
    const modal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Report Details Modal elements
    const reportModal = document.getElementById('report-details-modal');
    const reportModalTitle = document.getElementById('report-modal-title');
    const reportModalBody = document.getElementById('report-modal-body');
    const reportModalCloseBtn = document.getElementById('report-modal-close-btn');

    // Finalized Reports List elements
    const finalizedReportsList = document.getElementById('finalized-reports-list');
    const noReportsMessage = document.getElementById('no-reports-message');

    // App state and storage keys
    const BILLS_STORAGE_KEY = 'conveyanceBills';
    const COMPANY_STORAGE_KEY = 'companyName';
    const REPORTS_STORAGE_KEY = 'finalizedReports';
    const ADVANCE_STORAGE_KEY = 'advancePayment';
    let bills = [];
    let reports = [];
    let companyName = '';
    let advancePayment = 0;

    // --- Modal Functions ---

    // Enhanced Modal Functions
    const modalIcons = {
        error: `<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>`,
        success: `<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>`,
        warning: `<svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>`,
        info: `<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>`
    };

    const showModal = (title, content, type = 'error', onOk = null) => {
        const modalIcon = document.getElementById('modal-icon');
        const confirmBtn = document.getElementById('modal-confirm-btn');
        modalTitle.textContent = title;
        modalIcon.innerHTML = modalIcons[type] || modalIcons.info;

        // Apply color based on type
        const colorClasses = {
            error: 'text-red-600',
            success: 'text-green-600',
            warning: 'text-yellow-600',
            info: 'text-blue-600'
        };

        modalTitle.className = `text-xl font-bold ${colorClasses[type] || colorClasses.info}`;

        // Format content
        modalBody.innerHTML = `<p class="text-gray-600 leading-relaxed">${content}</p>`;

        // Setup OK button handler
        confirmBtn.onclick = () => {
            hideModal();
            if (onOk) onOk();
        };

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.remove('hidden');
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        });

        // Focus the confirm button for keyboard accessibility
        confirmBtn.focus();
    };

    const hideModal = () => {
        modal.classList.add('hidden');
        modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';

        const cancelBtn = document.getElementById('modal-cancel-btn');
        const confirmBtn = document.getElementById('modal-confirm-btn');

        cancelBtn.classList.add('hidden');
        confirmBtn.textContent = 'OK';

        confirmBtn.onclick = null;
        cancelBtn.onclick = null;

        modalBody.innerHTML = '';
        modalTitle.textContent = '';
    };

    const showConfirmModal = (title, content, type = 'warning', onConfirm) => {
        const cancelBtn = document.getElementById('modal-cancel-btn');
        const confirmBtn = document.getElementById('modal-confirm-btn');
        const modalIcon = document.getElementById('modal-icon');

        cancelBtn.classList.remove('hidden');
        confirmBtn.textContent = 'Confirm';
        modalTitle.textContent = title;
        modalIcon.innerHTML = modalIcons[type] || modalIcons.warning;

        const colorClasses = {
            error: 'text-red-600',
            success: 'text-green-600',
            warning: 'text-yellow-600',
            info: 'text-blue-600'
        };
        modalTitle.className = `text-xl font-bold ${colorClasses[type] || colorClasses.warning}`;

        modalBody.innerHTML = `<p class="text-gray-600 leading-relaxed">${content}</p>`;

        confirmBtn.onclick = null;
        cancelBtn.onclick = null;

        confirmBtn.onclick = () => {
            hideModal();
            if (onConfirm) onConfirm();
        };

        cancelBtn.onclick = hideModal;

        requestAnimationFrame(() => {
            modal.classList.remove('hidden');
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        });

        confirmBtn.focus();
    };

    modalCloseBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    document.getElementById('modal-cancel-btn').addEventListener('click', hideModal);

    // Show/Hide Report Details Modal
    const showReportDetailsModal = (day) => {
        const report = reports.find(r => r.day === day);
        if (!report) {
            showModal("Error", "Could not find the selected report.");
            return;
        }

        const totalAmount = parseFloat(report.total);
        // Use the report's saved advance payment if available, otherwise use the current advance payment
        const reportAdvancePayment = report.advancePayment !== undefined ? report.advancePayment : advancePayment;
        const remainingBalance = reportAdvancePayment > 0 ? reportAdvancePayment - totalAmount : 0;

        reportModalTitle.textContent = `Report for: ${report.day}`;
        document.getElementById('report-modal-subtitle').textContent = `${report.companyName} | ${report.bills.length} Entries`;

        // Add financial summary at the top
        const summaryHtml = `
            <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-500">Total Expenses</div>
                    <div class="text-lg font-bold text-gray-900">${totalAmount.toFixed(2)} Tk.</div>
                </div>
                ${reportAdvancePayment > 0 ? `
                    <div class="p-4 bg-green-50 rounded-lg">
                        <div class="text-sm text-green-600">Advance Payment</div>
                        <div class="text-lg font-bold text-green-700">${reportAdvancePayment.toFixed(2)} Tk.</div>
                    </div>
                    <div class="p-4 ${remainingBalance >= 0 ? 'bg-blue-50' : 'bg-red-50'} rounded-lg">
                        <div class="text-sm ${remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}">Remaining Balance</div>
                        <div class="text-lg font-bold ${remainingBalance >= 0 ? 'text-blue-700' : 'text-red-700'}">${remainingBalance.toFixed(2)} Tk.</div>
                    </div>
                ` : ''}</div>`;

        let tableHtml = summaryHtml + `
            <div class="overflow-x-auto border rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item/From</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendor/To</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;

        report.bills.forEach(bill => {
            tableHtml += `
                <tr>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${bill.time || '---'}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${bill.from || '---'}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${bill.to || '---'}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${bill.transport}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-right">${parseFloat(bill.amount).toFixed(2)}</td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                    <tfoot class="bg-gray-100">
                        <tr>
                            <td colspan="4" class="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase">Total</td>
                            <td class="px-4 py-2 text-right text-sm font-bold text-gray-900">${parseFloat(report.total).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        const downloadSection = `
            <div class="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button class="download-report-csv px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 flex items-center" data-day="${report.day}">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CSV
                </button>
                <button class="download-report-pdf px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center" data-day="${report.day}">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </button>
            </div>
        `;

        reportModalBody.innerHTML = tableHtml + downloadSection;
        reportModal.classList.remove('hidden');

        const downloadCsvBtn = reportModalBody.querySelector('.download-report-csv');
        const downloadPdfBtn = reportModalBody.querySelector('.download-report-pdf');

        downloadCsvBtn.addEventListener('click', () => downloadSingleReport(report, 'csv'));
        downloadPdfBtn.addEventListener('click', () => downloadSingleReport(report, 'pdf'));
    };

    const hideReportDetailsModal = () => {
        reportModal.classList.add('hidden');
    };

    reportModalCloseBtn.addEventListener('click', hideReportDetailsModal);
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            hideReportDetailsModal();
        }
    });

    const getTodayDate = () => new Date().toISOString().split('T')[0];

    // --- Data Management ---

    const loadCompanyName = () => {
        companyName = localStorage.getItem(COMPANY_STORAGE_KEY) || '';
        companyNameInput.value = companyName;
    };

    const saveCompanyName = () => {
        companyName = companyNameInput.value.trim();
        localStorage.setItem(COMPANY_STORAGE_KEY, companyName);
    };
    companyNameInput.addEventListener('input', saveCompanyName);

    // Advance Payment Modal Functions
    const advanceModal = document.getElementById('advance-modal');
    const advanceForm = document.getElementById('advance-form');
    const modalAdvanceAmount = document.getElementById('modal-advance-amount');
    const setAdvanceBtn = document.getElementById('set-advance-btn');
    const advanceModalClose = document.getElementById('advance-modal-close');
    const advanceModalCancel = document.getElementById('advance-modal-cancel');

    const showAdvanceModal = () => {
        modalAdvanceAmount.value = advancePayment || '';
        advanceModal.classList.remove('hidden');
        modalAdvanceAmount.focus();
    };

    const hideAdvanceModal = () => {
        advanceModal.classList.add('hidden');
        advanceForm.reset();
    };

    const loadAdvancePayment = () => {
        advancePayment = parseFloat(localStorage.getItem(ADVANCE_STORAGE_KEY) || '0');
        updateTotal();
    };

    const saveAdvancePayment = (e) => {
        e.preventDefault();
        const newAdvance = parseFloat(modalAdvanceAmount.value || '0');
        if (newAdvance >= 0) {
            advancePayment = newAdvance;
            localStorage.setItem(ADVANCE_STORAGE_KEY, advancePayment.toString());
            updateTotal();
            hideAdvanceModal();
            showModal(
                'Success',
                `Advance payment of ${advancePayment.toFixed(2)} Tk. has been saved.\n` +
                (advancePayment > 0 ? `You can see the remaining balance in the table summary below.` : ''),
                'success'
            );
        } else {
            showModal(
                'Error',
                'Please enter a valid advance payment amount.',
                'error'
            );
        }
    };

    setAdvanceBtn.addEventListener('click', showAdvanceModal);
    advanceModalClose.addEventListener('click', hideAdvanceModal);
    advanceModalCancel.addEventListener('click', hideAdvanceModal);
    advanceForm.addEventListener('submit', saveAdvancePayment);
    advanceModal.addEventListener('click', (e) => {
        if (e.target === advanceModal) {
            hideAdvanceModal();
        }
    });

    const sortBills = () => {
        bills.sort((a, b) => {
            const dateA = new Date(a.day);
            const dateB = new Date(b.day);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB - dateA;
            }
            if (a.time && b.time) {
                return a.time.localeCompare(b.time);
            }
            return a.time ? 1 : (b.time ? -1 : 0);
        });
    };

    const saveBills = () => {
        localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(bills));
    };

    const updateTotal = () => {
        const total = bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
        totalAmountCell.textContent = total.toFixed(2);

        // Show/hide and update advance payment and balance rows
        const advanceRow = document.getElementById('advance-row');
        const balanceRow = document.getElementById('balance-row');
        const advanceAmountCell = document.getElementById('advance-amount');
        const balanceAmountCell = document.getElementById('balance-amount');

        if (advancePayment > 0) {
            // Show advance payment row
            advanceRow.classList.remove('hidden');
            advanceAmountCell.textContent = advancePayment.toFixed(2);

            // Show balance row
            balanceRow.classList.remove('hidden');
            const remainingBalance = advancePayment - total;
            balanceAmountCell.textContent = remainingBalance.toFixed(2);

            // Update color based on remaining balance
            if (remainingBalance < 0) {
                balanceAmountCell.classList.remove('text-blue-700');
                balanceAmountCell.classList.add('text-red-700');
            } else {
                balanceAmountCell.classList.remove('text-red-700');
                balanceAmountCell.classList.add('text-blue-700');
            }
        } else {
            // Hide rows if no advance payment
            advanceRow.classList.add('hidden');
            balanceRow.classList.add('hidden');
        }
    };

    const renderBills = () => {
        tableBody.innerHTML = '';
        sortBills();
        bills.forEach(bill => addBillToTable(bill));
        updateTotal();
        saveBills();
    };

    const loadBills = () => {
        const storedBills = localStorage.getItem(BILLS_STORAGE_KEY);
        if (storedBills) {
            try {
                bills = JSON.parse(storedBills);
                renderBills();
            } catch (e) {
                console.error("Failed to parse stored bills:", e);
                showModal("Load Error", "Could not load previously saved data.");
                bills = [];
            }
        }
    };

    const loadFinalizedReports = () => {
        const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
        if (storedReports) {
            try {
                reports = JSON.parse(storedReports);
                reports.sort((a, b) => new Date(b.day) - new Date(a.day));
            } catch (e) {
                console.error("Failed to parse finalized reports:", e);
                reports = [];
            }
        }
    };

    const updateReportFinancials = (report) => {
        if (!report) return;
        report.total = report.bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
        if (report.advancePayment !== undefined) {
            report.remainingBalance = report.advancePayment - report.total;
        }
    };

    const saveFinalizedReports = () => {
        // Update financials for all reports before saving
        reports.forEach(updateReportFinancials);
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    };

    const renderFinalizedReportsList = () => {
        finalizedReportsList.innerHTML = '';
        if (reports.length === 0) {
            finalizedReportsList.appendChild(noReportsMessage);
            return;
        }

        reports.forEach(report => {
            const item = document.createElement('div');
            item.className = "flex justify-between items-center py-3";
            item.innerHTML = `
                <div>
                    <p class="font-medium text-gray-800">${report.day}</p>
                    <p class="text-sm text-gray-500">
                        Total: ${parseFloat(report.total).toFixed(2)} Tk. (${report.bills.length} entries)
                        ${report.advancePayment > 0 ?
                    `| Advance: ${report.advancePayment.toFixed(2)} Tk. | Remaining: ${report.remainingBalance.toFixed(2)} Tk.`
                    : ''}
                    </p>
                </div>
                <div class="space-x-2 flex">
                    <button class="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md view-report-btn" data-day="${report.day}">
                        View
                    </button>
                    <button class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded-md edit-report-btn" data-day="${report.day}">
                        Edit
                    </button>
                    <button class="text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md delete-report-btn" data-day="${report.day}">
                        Delete
                    </button>
                </div>
            `;
            finalizedReportsList.appendChild(item);
        });
    };

    const handleDeleteReport = (day) => {
        const report = reports.find(r => r.day === day);
        if (!report) return;

        const message = `
            Are you sure you want to PERMANENTLY delete the finalized report for ${day}?
            
            Report Details:
            Total Amount: ${parseFloat(report.total).toFixed(2)} Tk.
            Number of Entries: ${report.bills.length}
            
            This action cannot be undone.
        `;

        showConfirmModal(
            "Delete Report",
            message,
            'warning',
            () => {
                reports = reports.filter(r => r.day !== day);
                saveFinalizedReports();
                renderFinalizedReportsList();
                showModal("Success", `Report for ${day} deleted successfully.`, 'success');
            }
        );
    };

    const handleEditReport = (day) => {
        const reportToEdit = reports.find(r => r.day === day);
        if (!reportToEdit) {
            showModal("Error", "Report not found for editing.");
            return;
        }

        // Store the report's advance payment before editing
        const storedAdvancePayment = reportToEdit.advancePayment;

        const reportDetailsModal = document.getElementById('report-details-modal');
        const reportModalBody = document.getElementById('report-modal-body');

        reportModalBody.innerHTML = `
            <div class="p-4">
                <p class="mb-4 text-sm text-gray-600">Select the entries you want to edit:</p>
                <form id="edit-selection-form" class="space-y-3">
                    <div class="flex items-center mb-2">
                        <input type="checkbox" id="select-all" class="form-checkbox h-4 w-4 text-blue-600">
                        <label for="select-all" class="ml-2 text-sm font-medium text-gray-700">Select All</label>
                    </div>
                    <div class="border rounded-lg overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="w-10 px-4 py-2"></th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Item/From</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${reportToEdit.bills.map((bill, index) => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2">
                                            <input type="checkbox" name="selected-bills" value="${index}" 
                                                class="bill-checkbox form-checkbox h-4 w-4 text-blue-600">
                                        </td>
                                        <td class="px-4 py-2 text-sm">${bill.time || '---'}</td>
                                        <td class="px-4 py-2 text-sm">${bill.from || '---'}</td>
                                        <td class="px-4 py-2 text-sm">${bill.transport}</td>
                                        <td class="px-4 py-2 text-sm text-right">${parseFloat(bill.amount).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="flex justify-end space-x-3 mt-4">
                        <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md" 
                            onclick="document.getElementById('report-details-modal').classList.add('hidden')">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                            Edit Selected
                        </button>
                    </div>
                </form>
            </div>
        `;

        reportDetailsModal.classList.remove('hidden');

        const selectAllCheckbox = document.getElementById('select-all');
        const billCheckboxes = document.querySelectorAll('.bill-checkbox');

        selectAllCheckbox.addEventListener('change', (e) => {
            billCheckboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });

        let editingBills = [];

        const form = document.getElementById('edit-selection-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedIndices = Array.from(document.querySelectorAll('input[name="selected-bills"]:checked'))
                .map(checkbox => parseInt(checkbox.value));

            if (selectedIndices.length === 0) {
                showModal("Warning", "Please select at least one entry to edit.");
                return;
            }

            editingBills = selectedIndices.map(index => ({ ...reportToEdit.bills[index] }));
            reportToEdit.bills = reportToEdit.bills.filter((_, index) => !selectedIndices.includes(index));

            // Recalculate total and financial summary
            reportToEdit.total = reportToEdit.bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
            reportToEdit.advancePayment = storedAdvancePayment; // Maintain the original advance payment
            reportToEdit.remainingBalance = storedAdvancePayment - reportToEdit.total;

            if (reportToEdit.bills.length === 0) {
                reports = reports.filter(r => r.day !== day);
            }

            bills.push(...editingBills);

            saveFinalizedReports();
            renderFinalizedReportsList();
            renderBills();

            reportDetailsModal.classList.add('hidden');

            showModal(
                "Success",
                `Selected entries are now available for editing in the main table. After editing, use "Finalize & Save Day's Report" to add them back to the report.`,
                'success'
            );
        });
    };

    finalizedReportsList.addEventListener('click', (e) => {
        const target = e.target;
        const day = target.dataset.day;

        if (!day) return;

        if (target.classList.contains('view-report-btn')) {
            showReportDetailsModal(day);
        } else if (target.classList.contains('delete-report-btn')) {
            handleDeleteReport(day);
        } else if (target.classList.contains('edit-report-btn')) {
            handleEditReport(day);
        }
    });

    // Edit bill modal elements
    const editBillModal = document.getElementById('edit-bill-modal');
    const editBillForm = document.getElementById('edit-bill-form');
    const editBillId = document.getElementById('edit-bill-id');
    const editDay = document.getElementById('edit-day');
    const editTime = document.getElementById('edit-time');
    const editFrom = document.getElementById('edit-from');
    const editTo = document.getElementById('edit-to');
    const editTransport = document.getElementById('edit-transport');
    const editAmount = document.getElementById('edit-amount');
    const editModalCloseBtn = document.getElementById('edit-modal-close-btn');
    const editBillCancelBtn = document.getElementById('edit-bill-cancel');

    const showEditBillModal = (bill) => {
        editBillId.value = bill.id;
        editDay.value = bill.day;
        editTime.value = bill.time;
        editFrom.value = bill.from;
        editTo.value = bill.to;
        editTransport.value = bill.transport;
        editAmount.value = parseFloat(bill.amount).toFixed(2);

        editBillModal.classList.remove('hidden');
    };

    const hideEditBillModal = () => {
        editBillModal.classList.add('hidden');
        editBillForm.reset();
    };

    editBillForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const billIndex = bills.findIndex(b => b.id === editBillId.value);
        if (billIndex === -1) return;

        const updatedAmount = parseFloat(editAmount.value);
        if (isNaN(updatedAmount) || updatedAmount < 0) {
            showModal("Invalid Input", "Please enter a valid amount.");
            return;
        }

        const originalDay = bills[billIndex].day;
        const newDay = editDay.value;

        bills[billIndex] = {
            id: editBillId.value,
            day: newDay,
            time: editTime.value || '',
            from: editFrom.value.trim(),
            to: editTo.value.trim(),
            transport: editTransport.value.trim(),
            amount: updatedAmount
        };

        // If the day has changed and there's a finalized report for either day,
        // we need to update the financial summaries
        const originalReport = reports.find(r => r.day === originalDay);
        const newReport = reports.find(r => r.day === newDay);
        if (originalReport) updateReportFinancials(originalReport);
        if (newReport) updateReportFinancials(newReport);

        hideEditBillModal();
        renderBills();
        showModal("Success", "Bill entry updated successfully.", 'success');
    });

    editModalCloseBtn.addEventListener('click', hideEditBillModal);
    editBillCancelBtn.addEventListener('click', hideEditBillModal);
    editBillModal.addEventListener('click', (e) => {
        if (e.target === editBillModal) {
            hideEditBillModal();
        }
    });

    const addBillToTable = (bill) => {
        const newRow = document.createElement('tr');
        newRow.classList.add('hover:bg-gray-50');
        newRow.setAttribute('data-id', bill.id);
        newRow.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bill.day}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bill.time || '---'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bill.from || '---'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bill.to || '---'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${bill.transport}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${parseFloat(bill.amount).toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button class="text-blue-600 hover:text-blue-900 edit-btn">Edit</button>
                <button class="text-red-600 hover:text-red-900 remove-btn">Remove</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    };

    // Form submit
    billForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount < 0) {
            showModal("Invalid Input", "Please enter a valid amount.");
            return;
        }
        if (!dayInput.value) {
            showModal("Invalid Input", "Please select a date.");
            return;
        }
        if (!transportInput.value.trim()) {
            showModal("Invalid Input", "Please enter a category (e.g., Bus, Food).");
            return;
        }

        const newBill = {
            id: Date.now().toString(),
            day: dayInput.value,
            time: timeInput.value || '',
            from: fromInput.value.trim(),
            to: toInput.value.trim(),
            transport: transportInput.value.trim(),
            amount: amount
        };

        bills.push(newBill);
        renderBills();

        billForm.reset();
        dayInput.value = getTodayDate();
    });

    // Table actions
    tableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        const rowId = row.dataset.id;
        const billIndex = bills.findIndex(b => b.id === rowId);

        if (e.target.classList.contains('remove-btn')) {
            const bill = bills[billIndex];
            if (!bill) return;

            const message = `
                Are you sure you want to remove this entry?
                
                Entry Details:
                Date: ${bill.day}
                Time: ${bill.time || '---'}
                From: ${bill.from || '---'}
                To: ${bill.to || '---'}
                Category: ${bill.transport}
                Amount: ${parseFloat(bill.amount).toFixed(2)} Tk.
                
                This action cannot be undone.
            `;

            const modalContent = document.createElement('div');
            modalContent.innerHTML = message.split('\n').map(line =>
                `<p class="mb-1">${line.trim()}</p>`
            ).join('');

            showConfirmModal(
                "Remove Entry",
                modalContent.innerHTML,
                'warning',
                () => {
                    bills.splice(billIndex, 1);
                    saveBills();
                    renderBills();
                    showModal("Success", "Entry removed successfully.", 'success');
                }
            );
            return;
        }

        if (e.target.classList.contains('edit-btn')) {
            const bill = bills.find(b => b.id === rowId);
            if (bill) {
                showEditBillModal(bill);
            }
        }
    });

    // PDF & CSV
    const { jsPDF } = window.jspdf;

    const getFormattedFilename = (ext, dateStr) => {
        const date = dateStr || getTodayDate();
        const compName = companyName.trim() || 'Report';
        return `${compName}_${date}.${ext}`;
    };

    const downloadPdf = (dataToExport, filename, subtitle = '') => {
        const doc = new jsPDF();
        const tableHead = [['Day', 'Time', 'Item/From', 'Vendor/To', 'Category', 'Amount (Tk.)']];
        const tableBodyData = dataToExport.map(bill => [
            bill.day,
            bill.time || '---',
            bill.from || '---',
            bill.to || '---',
            bill.transport,
            parseFloat(bill.amount).toFixed(2)
        ]);

        // Calculate totals
        const totalExpenses = dataToExport.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
        const remainingBalance = advancePayment > 0 ? advancePayment - totalExpenses : 0;

        const total = dataToExport.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);

        doc.setFontSize(18);
        doc.text(`${companyName} - Bill Report`, 14, 22);

        if (subtitle) {
            doc.setFontSize(12);
            doc.text(subtitle, 14, 30);
        }

        doc.autoTable({
            head: tableHead,
            body: tableBodyData,
            startY: subtitle ? 35 : 30,
            headStyles: { fillColor: [37, 99, 235] },
            foot: [
                ['', '', '', '', 'Total Expenses', totalExpenses.toFixed(2)],
                ...(advancePayment > 0 ? [
                    ['', '', '', '', 'Advance Payment', advancePayment.toFixed(2)],
                    ['', '', '', '', 'Remaining Balance', remainingBalance.toFixed(2)]
                ] : [])
            ],
            footStyles: {
                fillColor: [229, 231, 235],
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            }
        });

        doc.save(filename);
    };

    const downloadSingleReport = (report, format) => {
        const filename = getFormattedFilename(format, report.day);
        const subtitle = `Date: ${report.day} | Total: ${parseFloat(report.total).toFixed(2)} Tk.`;

        if (format === 'pdf') {
            downloadPdf(report.bills, filename, subtitle);
        } else if (format === 'csv') {
            downloadCsv(report.bills, filename);
        }

        showModal(
            "Success",
            `Report for ${report.day} has been downloaded as ${format.toUpperCase()}.`,
            'success'
        );
    };

    const downloadCsv = (dataToExport, filename) => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Day,Time,Item/From,Vendor/To,Category,Amount\n";

        dataToExport.forEach(bill => {
            const row = [
                `"${bill.day}"`,
                `"${bill.time || ''}"`,
                `"${bill.from.replace(/"/g, '""') || ''}"`,
                `"${bill.to.replace(/"/g, '""') || ''}"`,
                `"${bill.transport.replace(/"/g, '""')}"`,
                parseFloat(bill.amount).toFixed(2)
            ].join(",");
            csvContent += row + "\n";
        });

        // Add financial summary
        const totalExpenses = dataToExport.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
        csvContent += `\n,,,,Total Expenses,${totalExpenses.toFixed(2)}\n`;

        if (advancePayment > 0) {
            const remainingBalance = advancePayment - totalExpenses;
            csvContent += `,,,,Advance Payment,${advancePayment.toFixed(2)}\n`;
            csvContent += `,,,,Remaining Balance,${remainingBalance.toFixed(2)}\n`;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    downloadPdfBtn.addEventListener('click', () => {
        if (bills.length === 0) return showModal("Error", "No bills to download.");
        downloadPdf(bills, getFormattedFilename('pdf', 'All_Days'));
    });

    downloadCsvBtn.addEventListener('click', () => {
        if (bills.length === 0) return showModal("Error", "No bills to download.");
        downloadCsv(bills, getFormattedFilename('csv', 'All_Days'));
    });

    finalizeDayBtn.addEventListener('click', () => {
        const today = dayInput.value || getTodayDate();
        const todayBills = bills.filter(bill => bill.day === today);

        if (todayBills.length === 0) {
            showModal("No Data", `There are no bill entries for ${today} to finalize.`);
            return;
        }

        let existingReport = reports.find(r => r.day === today);

        if (existingReport) {
            // Keep the original advance payment if it exists
            const reportAdvancePayment = existingReport.advancePayment !== undefined ?
                existingReport.advancePayment : advancePayment;

            existingReport.bills.push(...todayBills);
            existingReport.total = existingReport.bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
            existingReport.companyName = companyName.trim();
            existingReport.advancePayment = reportAdvancePayment;
            existingReport.remainingBalance = reportAdvancePayment - existingReport.total;
        } else {
            const total = todayBills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
            const newReport = {
                day: today,
                companyName: companyName.trim(),
                bills: todayBills,
                total: total,
                advancePayment: advancePayment,
                remainingBalance: advancePayment > 0 ? advancePayment - total : 0
            };
            reports.unshift(newReport);
        }

        reports.sort((a, b) => new Date(b.day) - new Date(a.day));
        reports.sort((a, b) => new Date(b.day) - new Date(a.day));

        bills = bills.filter(bill => bill.day !== today);

        saveBills();
        renderBills();
        saveFinalizedReports();
        renderFinalizedReportsList();

        const name = companyName.trim() || 'your company';
        showModal("Report Saved", `Report for ${today} from ${name} has been successfully saved. You can view it in the Finalized Daily Reports list below.`, false);
    });

    // --- Initialization ---
    loadCompanyName();
    loadBills();
    loadFinalizedReports();
    renderFinalizedReportsList();
    dayInput.value = getTodayDate();
});

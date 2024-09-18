document.addEventListener('DOMContentLoaded', () => {
    let lastAccountNumber = parseInt(localStorage.getItem('lastAccountNumber')) || 0;
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Show selected section and hide others
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    //

    function updateAccountList() {
        const accountTableBody = document.querySelector('#accountTable tbody');
        accountTableBody.innerHTML = ''; // Clear any existing rows

        if (accounts.length === 0) {
            accountTableBody.innerHTML = '<tr><td colspan="3">No accounts to show</td></tr>';
        } else {
            accounts.forEach(acc => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${acc.number}</td>
                    <td>${acc.name}</td>
                    <td>${acc.balance}</td>
                `;
                accountTableBody.appendChild(row);
            });
        }
    }

    updateAccountList();

    // Add event listeners to menu buttons
    document.querySelectorAll('.menu-grid button').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(sectionId);
        });
    });

    function validateFields(...fields) {
        return fields.every(field => field.value.trim() !== '');
    }

    // Handle section submissions
    document.querySelectorAll('.section button').forEach(button => {
        button.addEventListener('click', (event) => {
            const section = event.target.closest('.section');
            const sectionId = section.id;
            let message = '';

            if (sectionId === 'searchSection') {
                const searchAccNo = document.getElementById('searchAccNo');
                const searchResult = document.getElementById('accDetails');

                if (searchAccNo.value.trim() === '') {
                    message = 'Please enter an account number.';
                    searchResult.textContent = message;
                } else {
                    const account = accounts.find(acc => acc.number === parseInt(searchAccNo.value));
                    if (account) {
                        message = `Account Number: ${account.number}, Name: ${account.name}, Balance: ${account.balance}`;
                        searchResult.innerHTML = `
                            <strong>Account Number:</strong> ${account.number}<br>
                            <strong>Name:</strong> ${account.name}<br>
                            <strong>Balance:</strong> ${account.balance}
                        `;
                    } else {
                        message = `Account ${searchAccNo.value} not found.`;
                        searchResult.textContent = message;
                    }
                }
            } else if (sectionId === 'withdrawSection') {
                const accNo = document.getElementById('withdrawAccNo');
                const amount = document.getElementById('withdrawAmount');

                if (!validateFields(accNo, amount)) {
                    message = 'Please fill in all fields.';
                } else {
                    const account = accounts.find(acc => acc.number === parseInt(accNo.value));
                    if (account && account.balance >= parseFloat(amount.value)) {
                        account.balance -= parseFloat(amount.value);
                        message = `Withdrew ${amount.value} from account ${accNo.value}. New balance: ${account.balance}.`;
                    } else if (!account) {
                        message = `Account ${accNo.value} not found.`;
                    } else {
                        message = `Insufficient balance in account ${accNo.value}.`;
                    }
                    localStorage.setItem('accounts', JSON.stringify(accounts));
                    updateAccountList();
                }
            } else if (sectionId === 'transferSection') {
                const senderAccNo = document.getElementById('senderAccNo');
                const receiverAccNo = document.getElementById('receiverAccNo');
                const amount = document.getElementById('transferAmount');

                if (!validateFields(senderAccNo, receiverAccNo, amount)) {
                    message = 'Please fill in all fields.';
                } else {
                    const senderAccount = accounts.find(acc => acc.number === parseInt(senderAccNo.value));
                    const receiverAccount = accounts.find(acc => acc.number === parseInt(receiverAccNo.value));

                    if (senderAccount && receiverAccount && senderAccount.balance >= parseFloat(amount.value)) {
                        senderAccount.balance -= parseFloat(amount.value);
                        receiverAccount.balance += parseFloat(amount.value);
                        message = `Transferred ${amount.value} from account ${senderAccNo.value} to account ${receiverAccNo.value}.`;
                    } else if (!senderAccount) {
                        message = `Sender account ${senderAccNo.value} not found.`;
                    } else if (!receiverAccount) {
                        message = `Receiver account ${receiverAccNo.value} not found.`;
                    } else {
                        message = `Insufficient balance in account ${senderAccNo.value}.`;
                    }
                    localStorage.setItem('accounts', JSON.stringify(accounts));
                    updateAccountList();
                }
            } else if (sectionId === 'accountsSection') {
                const accName = document.getElementById('accName');
                const initialDeposit = document.getElementById('initialDeposit');

                if (!validateFields(accName, initialDeposit)) {
                    message = 'Please fill in all fields.';
                } else {
                    lastAccountNumber += 1;
                    const newAccountNumber = lastAccountNumber;
                    accounts.push({
                        number: newAccountNumber,
                        name: accName.value,
                        balance: parseFloat(initialDeposit.value)
                    });

                    message = `Added new account ${newAccountNumber} for ${accName.value} with an initial deposit of ${initialDeposit.value}.`;

                    localStorage.setItem('accounts', JSON.stringify(accounts));
                    localStorage.setItem('lastAccountNumber', lastAccountNumber.toString());
                    updateAccountList();

                    accName.value = '';
                    initialDeposit.value = '';
                }
            } else if (sectionId === 'searchSection') {
                const searchAccNo = document.getElementById('searchAccNo');

                if (searchAccNo.value.trim() === '') {
                    message = 'Please enter an account number.';
                } else {
                    const account = accounts.find(acc => acc.number === parseInt(searchAccNo.value));
                    if (account) {
                        message = `Account Number: ${account.number}, Name: ${account.name}, Balance: ${account.balance}`;
                    } else {
                        message = `Account ${searchAccNo.value} not found.`;
                    }
                }
                alert(message);
            }

            if (message) {
                alert(message);
            }
        });
    });
});

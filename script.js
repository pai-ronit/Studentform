

const sform = document.querySelector('#student-form');
const slist = document.querySelector('#student-list');
const ediv = document.querySelector('#error');
const deleteBtn = document.querySelector('#delete-btn');
const deleteIdInput = document.querySelector('#delete-id');
const updateBtn = document.querySelector('#update-btn');
const updateIdInput = document.querySelector('#update-id');
const updateModal = document.querySelector('#update-modal');
const closeModal = document.querySelector('#close-modal');
const updateForm = document.querySelector('#update-form');
const updateNameInput = document.querySelector('#update-name');
const updateAgeInput = document.querySelector('#update-age');
const updateErrorDiv = document.querySelector('#update-error');

let studentarray = [];
let currentUpdateId = null;


document.addEventListener('DOMContentLoaded', function() {
    displaystudent();
});


sform.addEventListener('submit', function(event) {
    event.preventDefault();
    const sid = document.querySelector('#student-id').value.trim();
    const sname = document.querySelector('#name').value.trim();
    const sage = document.querySelector('#age').value.trim();
    
    try {
        addstudent(sid, sname, sage);
        displaystudent();
        clearError();
        sform.reset();
        showSuccess('Student added successfully!');
    } catch (error) {
        showError(error.message);
    }
});


function showError(message) {
    ediv.textContent = message;
    ediv.style.display = 'block';
}

function showSuccess(message) {
    ediv.textContent = message;
    ediv.style.color = '#27ae60';
    ediv.style.backgroundColor = '#d5f4e6';
    ediv.style.borderLeftColor = '#27ae60';
    ediv.style.display = 'block';
    setTimeout(() => {
        clearError();
    }, 3000);
}

function clearError() {
    ediv.textContent = '';
    ediv.style.display = 'none';
    ediv.style.color = '#e74c3c';
    ediv.style.backgroundColor = '#fdf2f2';
    ediv.style.borderLeftColor = '#e74c3c';
}


function addstudent(sid, sname, sage) {
    if (!sid || !sname || !sage) {
        throw new Error('All fields are required');
    }
    if (isNaN(sage) || sage <= 0 || sage > 120) {
        throw new Error('Age must be a positive number between 1 and 120');
    }
    if (sname.length < 2) {
        throw new Error('Name must be at least 2 characters long');
    }
    const studentexists = studentarray.some(student => student.sid === sid);
    if (studentexists) {
        throw new Error('Student ID already exists');
    }
    const student = {
        sid,
        sname,
        sage: parseInt(sage)
    };
    studentarray.push(student);
}

function deletestudent(sid) {
    const idx = studentarray.findIndex(student => student.sid === sid);
    if (idx === -1) {
        throw new Error('Student ID not found');
    }
    studentarray.splice(idx, 1);
}

function updatestudent(sid, newName, newAge) {
    const student = studentarray.find(student => student.sid === sid);
    if (!student) {
        throw new Error('Student ID not found');
    }
    if (!newName || !newAge) {
        throw new Error('All fields are required');
    }
    if (isNaN(newAge) || newAge <= 0 || newAge > 120) {
        throw new Error('Age must be a positive number between 1 and 120');
    }
    if (newName.length < 2) {
        throw new Error('Name must be at least 2 characters long');
    }
    student.sname = newName.trim();
    student.sage = parseInt(newAge);
}

function displaystudent() {
    slist.innerHTML = '';
    if (studentarray.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.innerHTML = '<em style="color: #7f8c8d; font-style: italic></em>';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        slist.appendChild(emptyMessage);
        return;
    }

    studentarray.forEach((student) => {
        const li = document.createElement('li');

        
        const studentInfo = document.createElement('div');
        studentInfo.style.flex = '1';
        studentInfo.innerHTML = `
            <strong>ID:</strong> ${student.sid} | 
            <strong>Name:</strong> ${student.sname} | 
            <strong>Age:</strong> ${student.sage}
        `;

        li.appendChild(studentInfo);
        slist.appendChild(li);
    });
}


deleteBtn.addEventListener('click', function() {
    const sid = deleteIdInput.value.trim();
    if (!sid) {
        showError('Please enter a Student ID to delete');
        return;
    }
    try {
        deletestudent(sid);
        displaystudent();
        clearError();
        deleteIdInput.value = '';
        showSuccess('Student deleted successfully!');
    } catch (error) {
        showError(error.message);
    }
});


updateBtn.addEventListener('click', function() {
    const sid = updateIdInput.value.trim();
    if (!sid) {
        showError('Please enter a Student ID to update');
        return;
    }
    showUpdateModal(sid);
});

function showUpdateModal(sid) {
    const student = studentarray.find(student => student.sid === sid);
    if (!student) {
        showError('Student ID not found');
        return;
    }
    currentUpdateId = sid;
    updateNameInput.value = student.sname;
    updateAgeInput.value = student.sage;
    updateModal.style.display = 'block';
    updateErrorDiv.textContent = '';
    clearError();
}

closeModal.onclick = function() {
    updateModal.style.display = 'none';
    currentUpdateId = null;
}

updateForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newName = updateNameInput.value.trim();
    const newAge = updateAgeInput.value.trim();
    try {
        updatestudent(currentUpdateId, newName, newAge);
        displaystudent();
        updateModal.style.display = 'none';
        currentUpdateId = null;
        clearError();
        showSuccess('Student updated successfully!');
    } catch (error) {
        updateErrorDiv.textContent = error.message;
        updateErrorDiv.style.display = 'block';
    }
});


window.onclick = function(event) {
    if (event.target === updateModal) {
        updateModal.style.display = 'none';
        currentUpdateId = null;
    }
}

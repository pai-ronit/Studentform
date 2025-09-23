const sform = document.querySelector('#student-form');
const slist = document.querySelector('#student-list');
const ediv = document.querySelector('#error');

const studentarray = [];

sform.addEventListener('submit', function(event) {
    event.preventDefault();

    const sid = document.querySelector('#student-id').value;
    const sname = document.querySelector('#name').value;
    const sage = document.querySelector('#age').value;

    try {
        addstudent(sid, sname, sage);
        displaystudent();
        ediv.textContent = '';
    } catch (error) {
        ediv.textContent = error.message;
    }
});

function addstudent(sid, sname, sage) {
    if (!sid || !sname || !sage) {
        throw new Error('All fields are required');
    }
    if (isNaN(sage) || sage <= 0) {
        throw new Error('Age must be positive number');
    }
    const studentexists = studentarray.some(student => student.sid === sid);
    if (studentexists) {
        throw new Error('Student id already exists');
    }

    const student = {
        sid,
        sname,
        sage: parseInt(sage)
    };
    studentarray.push(student);
}

function displaystudent() {
    slist.innerHTML = '';
    studentarray.forEach((student) => {
        const li = document.createElement('li');
        li.textContent = `ID: ${student.sid}, NAME: ${student.sname}, AGE: ${student.sage}`;
        slist.appendChild(li);
    });
}

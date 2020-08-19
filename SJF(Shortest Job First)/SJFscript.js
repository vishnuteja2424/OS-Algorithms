let rows = 0;

/*
This works well but not getting why entered values are getting reset/erased
on adding a new job by clicking the ADD JOB button
:: FIXED ::
ISSUE Was: this was adding new tbody rather than tr
    let tab = document.querySelector("#Inputs");
*/
function AddJob() {
    let tab = document.querySelector("#Inputs").insertRow(++rows);
    tab.innerHTML +=
        `
        <tr>
            <td><input type="text" value="Job-${rows}" id="J${rows}" size="5" disabled></td>
            <td><input type="number" id="AT${rows}"></td>
            <td><input type="number" id="BT${rows}"></td>
            <td><input type="text" id="CT${rows}" size="5" disabled></td>
            <td><input type="text" id="TAT${rows}" size="5" disabled></td>
            <td><input type="text" id="WT${rows}" size="5" disabled></td>
            <td><input type="text" id="RT${rows}" size="5" disabled></td>
        </tr>
    `
}

/*
function AddJob() {
    let Row = document.querySelector("#Inputs").insertRow(++rows);
    let col = -1;
    let cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="text" value="Job-${rows}" id="J${rows }" size="5" disabled>`;
    cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="number" id="AT${rows}">`;
    cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="number" id="BT${rows}">`;
    cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="text" id="CT${rows}" size="5" disabled>`;
    cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="text" id="TAT${rows}" size="5" disabled>`;
    cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="text" id="WT${rows}" size="5" disabled>`;
    cell = Row.insertCell(++col);
    cell.innerHTML += `<input type="text" id="RT${rows}" size="5" disabled>`;
}
*/
function RemoveJob() {
    if (rows > 0)
        document.querySelector("#Inputs").deleteRow(rows--);
}

function Solve() {

    let table = [];
    // adding all the jobs data into an array
    for (let i = 1; i < rows + 1; ++i)
        table.push([Number(i), Number(document.getElementById(`AT${i}`).value), Number(document.getElementById(`BT${i}`).value), Number(0), Number(0), Number(0), Number(0)]);

    // sorting according to AT and if AT is same then BT
    for (let i = 0; i < rows; ++i) {
        for (let j = i + 1; j < rows; ++j) {
            if (table[j][1] < table[i][1]) {
                for (let k = 0; k < 3; ++k)
                    [table[j][k], table[i][k]] = [table[i][k], table[j][k]];
            }
            if (table[j][1] == table[i][1] && table[j][2] < table[i][2]) {
                for (let k = 0; k < 3; ++k)
                    [table[j][k], table[i][k]] = [table[i][k], table[j][k]];
            }
        }
    }

    // algorithm
    let curr = 0;
    let finished = 0;
    let completed = [];
    for (let i = 0; i < rows; ++i)
        completed.push(false);
    while (finished != rows) {

        let isthere = false;

        //check if any process is availabe or not
        for (let i = 0; i < rows; ++i) {
            if (!completed[i] && table[i][1] <= curr) {
                isthere = true;
                break;
            }
        }

        // if not available make the current timer to the next closest Job
        if (!isthere) {
            for (let i = 0; i < rows; ++i) {
                if (!completed[i]) {
                    curr = table[i][1];
                    break;
                }
            }
        }

        // get the list of all available Jobs
        let available = [];
        for (let i = 0; i < rows; ++i) {
            if (!completed[i] && table[i][1] <= curr)
                available.push(Number(i));
        }

        // now get the Job with lowest BT
        let present = available[0];
        let BT = table[available[0]][2];
        for (let i = 0; i < available.length; ++i) {
            if (table[available[i]][2] < BT) {
                BT = table[available[i]][2];
                present = available[i];
            }
        }

        // we got the process in present, complete it
        ++finished;
        completed[present] = true;
        curr += table[present][2];
        table[present][3] = curr;
        table[present][4] = table[present][3] - table[present][1];
        table[present][5] = table[present][4] - table[present][2];
        table[present][6] = curr - table[present][2] - table[present][1];
    }

    // setting the values to textbox
    for (let i = 0; i < rows; ++i) {
        document.getElementById(`CT${table[i][0]}`).value = `${table[i][3]}`;
        document.getElementById(`TAT${table[i][0]}`).value = `${table[i][4]}`;
        document.getElementById(`WT${table[i][0]}`).value = `${table[i][5]}`;
        document.getElementById(`RT${table[i][0]}`).value = `${table[i][6]}`;
    }
}
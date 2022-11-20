$(document).ready(async () => {
    let currentClass = (await getCurrentClass());

    let main = document.getElementById('main');
    let newTestButton = document.getElementById('new-test-button');
    newTestButton.addEventListener('click', () => {
        setModalContent("Create new test", createNewTestForm(currentClass.classCode));
        openModal();
    });

    let tests = await getTests(currentClass.classCode);
    tests.forEach(test => {
        console.log(test);
        let testCard = createDiv('test-card');
        let testImage = createDiv('test-image');
        let testDetails = createDiv('test-details');
        let testName = createSpan('test-name', test.name);

        testDetails.appendChild(testName);
        testCard.appendChild(testImage);
        testCard.appendChild(testDetails);

        testCard.addEventListener('click', () => {
            console.log(test);

            $.ajax({
                url: 'processing/set_current_test.php',
                type: 'POST',
                data: { 'test-id': test.id, 'test-name': test.name },
                success: () => {
                    window.location.assign('index.php');
                }
            });
        });

        main.appendChild(testCard);
    })
});

function createNewTestForm(classCode) {
    let form = document.createElement('form');
    form.id = 'new-test-form';
    let testNameLabel = createLabel('test-name', 'Test Name');
    let testName = document.createElement('input');
    testName.setAttribute('type', 'text');
    testName.setAttribute('name', 'test-name');
    testName.id = 'test-name';
    let testTypeLabel = createLabel('test-type', 'Test Type');
    let testType = document.createElement('input');
    testType.setAttribute('type', 'text');
    testType.setAttribute('name', 'test-type');
    testType.id = 'test-type';

    let submitButton = document.createElement('button');
    submitButton.textContent = "Submit";
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        let form = $('#new-test-form').serialize();
        console.log(form);
        $.ajax({
            type: 'POST',
            url: 'processing/new_test.php',
            data: form,
            dataType: 'text',
            success: () => {
                closeModal();
                location.reload();
            }
        })
    });

    form.appendChild(createHiddenInput('class-code', classCode));
    form.appendChild(testNameLabel);
    form.appendChild(testName);
    form.appendChild(testTypeLabel);
    form.appendChild(testType);
    form.appendChild(submitButton);

    return form;
}
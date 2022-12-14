$(document).ready(async () => {
    let main = document.getElementById('main');
    let newClassButton = document.getElementById('new-class-button');
    newClassButton.addEventListener('click', () => {
        setModalContent("Create new class", createNewClassForm());
        openModal();
    });

    let classes = await getClasses();
    classes.forEach(_class => {
        let classCard = createDiv('class-card');
        let classImage = createDiv('class-image');
        let classDetails = createDiv('class-details');
        classDetails.classList.add('row');
        let classCode = createSpan('class-code', _class.classCode);
        let classDescription = createSpan('class-description', _class.classDescription);

        let column = createDiv('column');
        column.appendChild(classCode);
        column.appendChild(classDescription);
        classDetails.appendChild(column);

        column = createDiv('column');
        let settingsButton = document.createElement('img');
        settingsButton.src = 'images/ellipsis.svg';
        settingsButton.classList.add('settings-button');
        let dropdown = document.createElement('ul');
        dropdown.classList.add('dropdown');
        let listItem = document.createElement('li');
        listItem.textContent = "Rename";
        dropdown.appendChild(listItem);
        listItem = document.createElement('li');
        listItem.textContent = 'Delete';
        dropdown.appendChild(listItem);
        column.appendChild(settingsButton);
        column.appendChild(dropdown);
        classDetails.appendChild(column);

        classCard.appendChild(classImage);
        classCard.appendChild(classDetails);

        classCard.addEventListener('click', () => {
            console.log(_class);
            $.ajax({
                url: 'processing/set_current_class.php',
                type: 'POST',
                data: { 'class-code': _class.classCode, 'class-description': _class.classDescription },
                success: () => {
                    window.location.assign('tests.php');
                }
            });
        })

        main.appendChild(classCard);
    });
});

function createNewClassForm() {
    let form = document.createElement('form');
    form.id = 'new-class-form';
    let classCodeLabel = createLabel('class-code', 'Class Code');
    let classCode = document.createElement('input');
    classCode.setAttribute('type', 'text');
    classCode.setAttribute('name', 'class-code');
    classCode.id = 'class-code';
    let classDescriptionLabel = createLabel('class-description', 'Class Description');
    let classDescription = document.createElement('input');
    classDescription.setAttribute('type', 'text');
    classDescription.setAttribute('name', 'class-description');
    classDescription.id = 'class-description';

    let submitButton = document.createElement('button');
    submitButton.textContent = "Submit";
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        let form = $('#new-class-form').serialize();
        console.log(form);
        $.ajax({
            type: 'POST',
            url: 'processing/new_class.php',
            data: form,
            dataType: 'text',
            success: () => {
                closeModal();
                location.reload();
            }
        })
    });

    form.appendChild(classCodeLabel);
    form.appendChild(classCode);
    form.appendChild(classDescriptionLabel);
    form.appendChild(classDescription);
    form.appendChild(submitButton);

    return form;
}
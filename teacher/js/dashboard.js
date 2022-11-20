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
        let classCode = createSpan('class-code', _class.classCode);
        let classDescription = createSpan('class-description', _class.classDescription);

        classDetails.appendChild(classCode);
        classDetails.appendChild(classDescription);
        classCard.appendChild(classImage);
        classCard.appendChild(classDetails);

        classCard.addEventListener('click', () => {
            console.log(_class);
            $.ajax({
                url: 'processing/set_session.php',
                type: 'POST',
                data: { 'class-code': _class.classCode, 'class-description': _class.classDescription },
                success: () => {
                    window.location.assign('index.php');
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
    let classDescriptionLabel = createLabel('class-description', 'Test Type');
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
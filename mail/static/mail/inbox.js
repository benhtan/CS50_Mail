document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Find #recipient-error-msg and don't display it
  document.querySelector('#recipient-error-msg').style.display = 'none';

  // By default, load the inbox
  load_mailbox('inbox');

  // event handler when new mail form is submitted
  document.querySelector('#compose-form').onsubmit = function() {
    console.log(document.querySelector('#compose-recipients').value);

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);

        // if no error
        if (result.error === undefined){
          load_mailbox('sent');
        } else {
          document.querySelector('#recipient-error-msg').innerHTML = result.error;
          document.querySelector('#recipient-error-msg').style.display = 'block';
          document.querySelector('#compose-recipients').focus();
        }
    })
    .catch(error => {
      console.log('Error: ', error);
    });

    return false;
  };
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#recipient-error-msg').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
 
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch mailbox
  // console.log('/emails/' + mailbox)
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      // console.log(emails);
      emails.forEach(function(email){
        const element = document.createElement('div'); element.className = 'row emailBorder';
        const sender = document.createElement('div'); sender.className = 'col-4'; sender.innerHTML = email.sender;
        const subject = document.createElement('div');  subject.className = 'col-4'; subject.innerHTML = email.subject;
        const timestamp = document.createElement('div');  timestamp.className = 'col-4'; timestamp.style = 'text-align: right;';timestamp.innerHTML = email.timestamp;

        element.append(sender); element.append(subject); element.append(timestamp);
        //element.innerHTML = `${email.sender}    ${email.subject}    ${email.timestamp}`;
        document.querySelector('#emails-view').append(element);
        //console.log(email.subject);
      });

      
  });

}
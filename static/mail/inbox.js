document.addEventListener('DOMContentLoaded', function load () {

  var mail = document.querySelector('#mailbox').innerText;
  var id = document.querySelector('#id').innerText;

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(i => {
      i.classList.remove("active");
    });
    document.querySelector('#inbox').classList.add('active');
    load_mailbox('inbox');
  });
  document.querySelector('#sent').addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(i => {
      i.classList.remove("active");
    });
    document.querySelector('#sent').classList.add('active');
    load_mailbox('sent');
  });
  document.querySelector('#archive').addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(i => {
      i.classList.remove("active");
    });
    document.querySelector('#archive').classList.add('active');
    load_mailbox('archive');
  });
  document.querySelector('#compose').addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(i => {
      i.classList.remove("active");
    });
    compose_email();
  });

  // By default, load the inbox
  // load_mailbox('inbox');
  if (id != "None") {
    if (mail === "reply") {
      reply(id)
    } else if (mail === "forward") {
      fwd(id)
    } else {
      load_mail(mail, id);
    }
  } else {
    if (window.location.pathname === '/hmail/u/compose') {
        compose_email();
    } else {
      load_mailbox(mail);
    }
  }
});

var userEList = []
var userNList = []
fetch('/hmail/users')
.then(response => response.json())
.then(users => {
  users.forEach(i => {
    userEList.push(i.email);
    userNList.push(i.username);
  });
})

function compose_email() {
  if (window.location.pathname != '/hmail/u/compose') {
      window.location.pathname = '/hmail/u/compose';
  }
  document.querySelector('#compose').classList.add('active');
  // Show the mailbox and hide other views
  document.querySelector('#email-view-contents').style.display = 'none';
  document.getElementById('compose-view').style.display = "block";
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose_body').innerHTML = '<span id="replyto" style="z-index: -20" hidden></span><span id="compose_edit" contenteditable="true"></span>';
}

function load_mailbox(mailbox) {
  if (window.location.pathname !== `/hmail/u/${mailbox}`) {
      window.location.pathname = `/hmail/u/${mailbox}`;
  }
  document.querySelector(`#${mailbox}`).classList.add('active');
  if (window.location.pathname === `/hmail/u/compose`) {
    compose_email();
  }else {
    // Show the mailbox and hide other views
    document.querySelector('#email-view-contents').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    fetch(`/hmail/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      var contents = '';
      if (emails.length === 0) {
        contents = `<div class="display-4 text-center mt-5">You have 0 Emails in your <span style="text-transform: capitalize;"><b>${mailbox}</b></span> Folder</div>`;
      } else {
        if (mailbox === "sent") {
          emails.forEach(i => {
            if (i['read']) {
              contents = contents +`
              <button class="btn btn-outline-light bg-light-x mail row container-fluid float-start text-nowrap p-1 unread border border-black border-start-0 border-end-0" id="mail_id_${i.id}" onClick="load_mail('${mailbox}', ${i.id})">
                <div class="col-sm row text-nowrap">
                  <div class="col-3 float-start mailsender pe-2 text-truncate">To: ${i['recipientsName']}</div>
                  <div class="col mailsubject pe-1 text-truncate">${i['subject']}
                  <span class="mailbody text-muted ps-2 text-truncate">${extractContent(i['body'])}</span></div>
                  <div class="col-1 text-muted mailtimestamp">${i['timestamp']}</div>
                </div>
              </button>
              `;
            } else {
              contents = contents +`
              <button class="btn btn-outline-light bg-white bg-gradient mail row container-fluid float-start text-nowrap p-1 read border border-black border-start-0 border-end-0" id="mail_id_${i.id}" onClick="load_mail('${mailbox}', ${i.id})">
                <div class="col-sm row text-nowrap">
                  <div class="col-3 mailsender text-truncate">To: ${i['recipientsName']}</div>
                  <div class="col mailsubject text-truncate">${i['subject']}
                  <span class="mailbody text-muted ps-2 text-truncate">${extractContent(i['body'])}</span></div>
                  <div class="col-1 text-muted float-end mailtimestamp">${i['timestamp']}</div>
                </div>
              </button>
              `;
            }
          });
        }
        if (mailbox === "archive") {
          emails.forEach(i => {
            if (i['read']) {
              contents = contents +`
              <button class="btn btn-outline-light bg-light mail row container-fluid float-start text-nowrap p-1 unread border border-black border-start-0 border-end-0" id="mail_id_${i.id}" onClick="load_mail('${mailbox}', ${i.id})">
                <div class="col-sm row text-nowrap">
                  <div class="col-3 float-start mailsender pe-2 text-truncate">${i['sender']}</div>
                  <div class="col mailsubject pe-1 text-truncate">${i['subject']}
                  <span class="mailbody text-muted ps-2 text-truncate">${extractContent(i['body'])}</span></div>
                  <div class="col-1 text-muted mailtimestamp">${i['timestamp']}</div>
                </div>
              </button>
              `;
            } else {
              contents = contents +`
              <button class="btn btn-outline-light bg-white bg-gradient mail row container-fluid float-start text-nowrap p-1 read border border-black border-start-0 border-end-0" id="mail_id_${i.id}" onClick="load_mail('${mailbox}', ${i.id})">
                <div class="col-sm row text-nowrap">
                  <div class="col-3 mailsender text-truncate">${i['sender']}</div>
                  <div class="col mailsubject text-truncate">${i['subject']}
                  <span class="mailbody text-muted ps-2 text-truncate">${extractContent(i['body'])}</span></div>
                  <div class="col-1 text-muted float-end mailtimestamp">${i['timestamp']}</div>
                </div>
              </button>
              `;
            }
          });
        }
        if (mailbox === "inbox") {
          emails.forEach(i => {
            if (i['read']) {
              contents = contents +`
              <button class="btn btn-outline-light bg-light mail row container-fluid float-start text-nowrap p-1 unread border border-black border-start-0 border-end-0" id="mail_id_${i.id}" onClick="load_mail('${mailbox}', ${i.id})">
                <div class="col-sm row text-nowrap">
                  <div class="col-3 float-start mailsender pe-2 text-truncate">${i['sender']}</div>
                  <div class="col mailsubject pe-1 text-truncate">${i['subject']}
                  <span class="mailbody text-muted ps-2 text-truncate">${extractContent(i['body'])}</span></div>
                  <div class="col-1 text-muted mailtimestamp">${i['timestamp']}</div>
                </div>
              </button>
              `;
            } else {
              contents = contents +`
              <button class="btn btn-outline-light bg-white bg-gradient mail row container-fluid float-start text-nowrap p-1 read border border-black border-start-0 border-end-0" id="mail_id_${i.id}" onClick="load_mail('${mailbox}', ${i.id})">
                <div class="col-sm row text-nowrap">
                  <div class="col-3 mailsender text-truncate">${i['sender']}</div>
                  <div class="col mailsubject text-truncate">${i['subject']}
                  <span class="mailbody text-muted ps-2 text-truncate">${extractContent(i['body'])}</span></div>
                  <div class="col-1 text-muted float-end mailtimestamp">${i['timestamp']}</div>
                </div>
              </button>
              `;
            }
          });
        }
        document.querySelectorAll('.mailsender').forEach(i => {
          i.innerHTML = i.innerHTML.replace(document.querySelector('#useremailname').innerHTML,"Me");
        });
      }
      document.querySelector('#email-view-contents').innerHTML = contents;
    });
  }
}

function load_mail(mailbox,mail) {
  if (window.location.pathname !== `/hmail/u/${mailbox}/${mail}`) {
      window.location.pathname = `/hmail/u/${mailbox}/${mail}`;

      fetch(`/hmail/emails/${mail}`,{
        method: 'PUT',
        body: JSON.stringify({
          read: false
        })
      })
  }
  document.querySelector(`#${mailbox}`).classList.add('active');
  if (window.location.pathname === `/hmail/u/compose`) {
    compose_email()
  }
  // Show the mailox and hide other views
  document.querySelector('#email-view-contents').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`/hmail/emails/${mail}`)
  .then(response => {
    if (!response.ok) {
      window.location.pathname = `/hmail/u/${mailbox}`;
    }
    return response.json()
  })
  .then(email => {
    document.querySelector('#view-mail-subject').innerHTML = `${email['subject']}`;
    document.querySelector('#senders-mailId').innerHTML = `<b style="font-size:20px;">${email['senderName']}</b><span class="text-muted"> &lt;${email['sender']}&gt; </span>`;

    document.querySelector('#view-mail-timestamp').innerHTML = `${email['timestamp']}`;

    document.querySelector('#recipients-mailId').innerHTML = `To : ${email['recipientsName']}`;

    document.querySelector('#recipients-mailId').innerHTML = document.querySelector('#recipients-mailId').innerHTML.replace(document.querySelector('#useremailname').innerHTML, "me");

    document.querySelector('#view-mail-body').innerHTML = `${email['body']}`

    if(email['read']) {
      document.querySelector('#mail-read-unread').title = "Mark as Read";
      document.querySelector('#switchread').classList.add("fa-envelope-open");
    } else {
      document.querySelector('#mail-read-unread').title = "Mark as Unread";
      document.querySelector('#switchread').classList.add("fa-envelope");
    }
    if (email['archived']) {
      document.querySelector('#switcharchive').classList.add("fa-inbox");
      document.querySelector('#archive-mail').title = "Move to Inbox";
    } else {
      document.querySelector('#archive-mail').title = "Move to Archived";
      document.querySelector('#switcharchive').classList.add("fa-archive");
    }
    document.querySelector('.compose_edit_to').contentEditable = false
  });
}

function validate() {
  var recipients = document.getElementById('compose-recipients');
  var list = recipients.value.split(',');
  message = ""
  if (list[0] != "") {
    list.forEach(i => {
      if (!userEList.includes(i.trim())) {
        if (userNList.includes(i.trim())) {
          if (i.trim() === document.querySelector('#useremailname').innerHTML) {
            var newL = recipients.value.replace(i.trim(),"Email will be available in your sent Folder");
            recipients.value = newL;
            var newL = recipients.value.replace("Email will be available in your sent Folder","");
            setTimeout(() => {recipients.value = newL;},3000);
          } else {
            var newL = recipients.value.replace(i.trim(),userEList[userNList.indexOf(i.trim())]);
            recipients.value = newL;
          }
        } else {
          message = message + `'${i}' `
        }
      } else {
        if (i.trim() === document.querySelector('#useremail').innerHTML) {
          var newL = recipients.value.replace(i.trim(),"Email will be available in your sent Folder");
          recipients.value = newL;
          var newL = recipients.value.replace("Email will be available in your sent Folder","");
          setTimeout(() => recipients.value = newL,1500);
        }
      }
    });
    if (message != "") {
      recipients.setCustomValidity(`EmailId : ${message} are not Available`);
      recipients.reportValidity();
    } else {
      recipients.setCustomValidity("");
    }
  }
}

function handleForm(event) {
  validate()
  document.getElementById('compose_edit').contentEditable = false;
  document.querySelector('#replyto').classList.add(`reply_to`);
  document.querySelector("#replyto").removeAttribute("id");
  document.querySelector('#compose_edit').classList.add(`compose_edit_to`);
  document.querySelector("#compose_edit").removeAttribute("id");
  document.querySelector('.compose_edit_to').contentEditable = false

  fetch('/hmail/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: `${document.querySelector('#compose-recipients').value}`,
      subject: `${document.querySelector('#compose-subject').value}`,
      body: `<div>${document.querySelector('#compose_body').innerHTML}<div>`,
    })
  })
  .then(response => response.json())
  .then(email => {
    console.log(email);
  });
  event.preventDefault();
  document.getElementById('sent').click();
  return false;
}

function extractContent(s) {
  var span = document.createElement('span');
  span.innerHTML = s;

  return span.textContent || span.innerText;
};

function Archived(mail) {
  fetch(`/hmail/emails/${mail}`)
  .then(response => response.json())
  .then(email => {
    if (email['archived']) {
      fetch(`/hmail/emails/${mail}`,{
        method: 'PUT',
        body: JSON.stringify({
          archive: false
        })
      })
      .then(response => response.json())
      .then(status => {
        console.log(status)
      });
      window.location.pathname = `/hmail/u/inbox/${mail}`
    }
    else {
      fetch(`/hmail/emails/${mail}`,{
        method: 'PUT',
        body: JSON.stringify({
          archive: true
        })
      })
      .then(response => response.json())
      .then(status => {
        console.log(status)
      });
      window.location.pathname = `/hmail/u/archive/${mail}`
    }
  })
}

function ChangeViewedStatus(mail, status) {
  fetch(`/hmail/emails/${mail}`)
  .then(response => response.json())
  .then(email => {
    if (email['read']) {
      fetch(`/hmail/emails/${mail}`,{
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
      .then(response => response.json())
      .then(status => {
        console.log(status)
      });
    }
    else {
      fetch(`/hmail/emails/${mail}`,{
        method: 'PUT',
        body: JSON.stringify({
          read: false
        })
      })
      .then(response => response.json())
      .then(status => {
        console.log(status)
      });
    }
  })
  var mailbox = document.querySelector('#mailbox').innerText;
  window.location.pathname = `hmail/u/${mailbox}`
}

function DeleteMail(mail) {
  fetch(`/hmail/emails/${mail}`,{
    method: 'PUT',
    body: JSON.stringify({
      delete: true
    })
  })
  .then(response => response.json())
  .then(status => {
    console.log(status)
  });
  window.location.pathname = `hmail`
}

function reply(mail) {
  if (window.location.pathname !== `/hmail/u/reply/${mail}`) {
      window.location.pathname = `/hmail/u/reply/${mail}`;
  }

  document.querySelector('#compose').classList.add('active');
  // Show the mailbox and hide other views
  document.querySelector('#email-view-contents').style.display = 'none';
  document.getElementById('compose-view').style.display = "block";
  document.getElementById('replyto').hidden = false;

  //Fetch Reply mail
  fetch(`/hmail/emails/${mail}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = `${email['sender']} ,${email['recipientsName']}`;
    validate();
    document.querySelector('#compose-recipients').setAttribute('readonly', true);

    if (email['subject'].startsWith('Re : ')) {
      document.querySelector('#compose-subject').value = `${email['subject']}`;
    } else {
      if (email['subject'].startsWith('Fwd : ')) {
        document.querySelector('#compose-subject').value = `${email['subject'].replace('Fwd : ', 'Re : ')}`;
      } else {
        document.querySelector('#compose-subject').value = `Re : ${email['subject']}`;
      }
    }

    document.querySelector('#replyto').innerHTML = `On ${email['timestamp']}, ${email['senderName']}(${email['sender']}) wrote : <br><br>${email['body']}<br><br><hr>`;
  });
}

function fwd(mail) {
  if (window.location.pathname !== `/hmail/u/forward/${mail}`) {
      window.location.pathname = `/hmail/u/forward/${mail}`;
  }

  document.querySelector('#compose').classList.add('active');
  // Show the mailbox and hide other views
  document.querySelector('#email-view-contents').style.display = 'none';
  document.getElementById('compose-view').style.display = "block";
  document.getElementById('replyto').hidden = false;

  //Fetch Reply mail
  fetch(`/hmail/emails/${mail}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = ``;

    if (email['subject'].startsWith('Fwd : ')) {
      document.querySelector('#compose-subject').value = `${email['subject']}`;
    } else {
      if (email['subject'].startsWith('Re : ')) {
        document.querySelector('#compose-subject').value = `${email['subject'].replace('Re : ', 'Fwd : ')}`;
      } else {
        document.querySelector('#compose-subject').value = `Fwd : ${email['subject']}`;
      }
    }

    document.querySelector('#replyto').innerHTML = `On ${email['timestamp']}, ${email['senderName']}(${email['sender']}) wrote to ${email['recipientsName']}: <br><br>`
    document.querySelector('#compose_edit').innerHTML = `${email['body']}`;
    document.querySelector('#compose_body').setAttribute('readonly', true);
    document.querySelector('#compose-subject').setAttribute('readonly', true);
  });
}

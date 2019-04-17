'use strict'

let id = val => document.getElementById(val),
  ul = id('ul'),
  mediaBtn = id('media_btn'),
  start = id('start'),
  stop = id('stop'),
  recording = id('recording'),
  upload = id('upload'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;


mediaBtn.onclick = e => {
  let mv = id('mediaVideo'),
      mediaOptions = {
        video: {
          tag: 'video',
          type: 'video/webm',
          ext: '.mp4',
          gUM: {video: true, audio: true}
        },
        audio: {
          tag: 'audio',
          type: 'audio/ogg',
          ext: '.ogg',
          gUM: {audio: true}
        }
      };
  media = mv.checked ? mediaOptions.video : mediaOptions.audio;
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    id('radio').style.display = 'none';
    id('buttons').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive')  makeLink();
    };
      console.log('Запись включена');
  }).catch(e);
}

start.onclick = e => {
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks=[];
  recorder.start();
  recording.style.display = 'inherit';
}


stop.onclick = e => {
  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');
  recording.style.display = 'none';
}

function makeLink(){
  let blob = new Blob(chunks, {type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
    , upl = document.createElement('a')
  ;
  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `Скачать файл ${hf.download}`;
  upl.href = '#';
  upl.innerHTML = 'Отправить на сервер';

  upl.onclick = e => {
    e.preventDefault()

    let blob = new Blob(chunks, {type: media.type })

    let xhr = new XMLHttpRequest();

    xhr.open("POST", 'upload.php', true);

    xhr.onload = function (e) {
        console.log(e);
    };

    xhr.send(blob);
  }

  li.appendChild(mt);
  li.appendChild(hf);
  li.appendChild(upl);
  ul.appendChild(li);
}

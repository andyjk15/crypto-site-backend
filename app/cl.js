cl()

function cl() {
    console.log('child process');
}
setInterval(cl, 30000);

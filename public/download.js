onmessage = function (ev) {
  const list = ev.data || [];
  list.forEach(function (v) {
    const url = v.fileUrl;
    fetch(url)
      .then(function (res) {
        res.blob().then(function (blob) {
          self.postMessage({
            file: v,
            blob: URL.createObjectURL(blob),
          });
        });
      })
      .catch(function (err) {
        console.error('download_worker error:', err);
      });
  });
};

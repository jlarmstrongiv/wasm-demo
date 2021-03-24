/*
 * WASI is our implementaiton of a minimal WASI polyfill.
 * This was heavily inspired by http://www.wasmtutor.com/webassembly-barebones-wasi
 * with some minor tweaks
 */

let WASI = function () {
  let moduleInstanceExports = null;
  const WASI_ESUCCESS = 0;
  const WASI_EBADF = 8;
  const WASI_EINVAL = 28;
  const WASI_ENOSYS = 52;
  const WASI_STDOUT_FILENO = 1;

  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  function getModuleMemoryDataView() {
    return new DataView(moduleInstanceExports.memory.buffer);
  }

  function fd_prestat_get(fd, bufPtr) {
    console.log("Call to WASI.fd_prestat_get()");
    return WASI_EBADF;
  }

  function fd_prestat_dir_name(fd, pathPtr, pathLen) {
    console.log("Call to WASI.fd_prestat_dir_name()");
    return WASI_EINVAL;
  }

  function environ_sizes_get(environCount, environBufSize) {
    console.log("Call to WASI.environ_sizes_get()");
    const view = getModuleMemoryDataView();
    view.setUint32(environCount, 0, !0);
    view.setUint32(environBufSize, 0, !0);
    return WASI_ESUCCESS;
  }

  function environ_get(environ, environBuf) {
    console.log("Call to WASI.environ_get()");
    return WASI_ESUCCESS;
  }

  function args_sizes_get(argc, argvBufSize) {
    console.log("Call to WASI.args_sizes_get()");
    const view = getModuleMemoryDataView();
    view.setUint32(argc, 0, !0);
    view.setUint32(argvBufSize, 0, !0);
    return WASI_ESUCCESS;
  }

  function args_get(argv, argvBuf) {
    console.log("Call to WASI.args_get()");
    return WASI_ESUCCESS;
  }

  function fd_fdstat_get(fd, bufPtr) {
    console.log("Call to WASI.fd_fdstat_get()");
    const view = getModuleMemoryDataView();
    view.setUint8(bufPtr, fd);
    view.setUint16(bufPtr + 2, 0, !0);
    view.setUint16(bufPtr + 4, 0, !0);

    function setBigUint64(byteOffset, value, littleEndian) {
      const lowWord = value;
      const highWord = 0;
      view.setUint32(littleEndian ? 0 : 4, lowWord, littleEndian);
      view.setUint32(littleEndian ? 4 : 0, highWord, littleEndian);
    }

    setBigUint64(bufPtr + 8, 0, !0);
    setBigUint64(bufPtr + 8 + 8, 0, !0);
    return WASI_ESUCCESS;
  }

  function fd_write(fd, iovs, iovsLen, nwritten) {
    console.log("Call to WASI.fd_write()");
    const view = getModuleMemoryDataView();
    let written = 0;
    const bufferBytes = [];

    function getiovs(iovs, iovsLen) {
      const buffers = Array.from({ length: iovsLen }, function (_, i) {
        const ptr = iovs + i * 8;
        const buf = view.getUint32(ptr, !0);
        const bufLen = view.getUint32(ptr + 4, !0);
        return new Uint8Array(moduleInstanceExports.memory.buffer, buf, bufLen);
      });
      return buffers;
    }

    let buffers = getiovs(iovs, iovsLen);

    function writev(iov) {
      for (var b = 0; b < iov.byteLength; b++) {
        bufferBytes.push(iov[b]);
        // B is undefined
      }
      written += b;
    }

    buffers.forEach(writev);
    if (fd === WASI_STDOUT_FILENO) {
      console.log(
        "Error in WASI:" + String.fromCharCode.apply(null, bufferBytes)
      );
    }
    view.setUint32(nwritten, written, !0);

    return WASI_ESUCCESS;
  }

  function poll_oneoff(sin, sout, nsubscriptions, nevents) {
    console.log("Call to WASI.poll_oneoff()");
    return WASI_ENOSYS;
  }

  function proc_exit(rval) {
    console.log("Call to WASI.proc_exit()");
    return WASI_ENOSYS;
  }

  function fd_close(fd) {
    console.log("Call to WASI.fd_close()");
    return WASI_ENOSYS;
  }

  function fd_seek(fd, offset, whence, newOffsetPtr) {
    console.log("Call to WASI.fd_seek()");
  }

  function fd_close(fd) {
    console.log("Call to WASI.fd_close()");
    return WASI_ENOSYS;
  }

  // added stubs
  function fd_fdstat_set_flags() {
    console.log("WASI.stub.1");
  }

  function path_open() {
    console.log("WASI.stub.2");
  }

  function fd_read() {
    console.log("WASI.stub.3");
  }

  function fd_datasync() {
    console.log("WASI.stub.4");
  }

  function random_get() {
    console.log("WASI.stub.5");
  }

  function clock_res_get() {
    console.log("WASI.stub.6");
  }

  function clock_time_get() {
    console.log("WASI.stub.7");
  }

  //end

  return {
    setModuleInstance: setModuleInstance,
    environ_sizes_get: environ_sizes_get,
    args_sizes_get: args_sizes_get,
    fd_prestat_get: fd_prestat_get,
    fd_fdstat_get: fd_fdstat_get,
    fd_write: fd_write,
    fd_prestat_dir_name: fd_prestat_dir_name,
    environ_get: environ_get,
    args_get: args_get,
    poll_oneoff: poll_oneoff,
    proc_exit: proc_exit,
    fd_close: fd_close,
    fd_seek: fd_seek,
    fd_fdstat_set_flags: fd_fdstat_set_flags,
    path_open: path_open,
    fd_read: fd_read,
    fd_datasync: fd_datasync,
    random_get: random_get,
    clock_res_get: clock_res_get,
    clock_time_get: clock_time_get,
    getModuleMemoryDataView: getModuleMemoryDataView,
  };
};

module.exports = { WASI };

export const createModuleReadyPromise = (port: MessagePort) =>
  new Promise(resolve =>
    port.addEventListener('message', function moduleReady(event) {
      if (event.data && event.data.type === 'module-ready' && event.data.value) {
        resolve();
        port.removeEventListener('message', moduleReady);
      }
    })
  );

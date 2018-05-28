(() => {
    self.installOfflineWatcher((offline) => {
        isAppOffline(offline);
    });

    function isAppOffline(offline) {
        const els = document.querySelectorAll('.offline');
        if (offline) {
            els.forEach(el => el.classList.remove('hidden'));
        } else {
            els.forEach(el => {
                if (!el.classList.contains('hidden')) {
                    el.classList.add('hidden');
                }
            });
        }
    }
})();
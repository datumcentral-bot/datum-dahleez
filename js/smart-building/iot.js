/**
 * DATUM DAHLEEZ Smart Building Integration
 * IoT control layer stub
 */
class IoTLayer {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
    }
    async init() { return true; }
    getSupportedProtocols() { return ['KNX', 'Zigbee', 'Z-Wave', 'Matter', 'WiFi', 'Bluetooth']; }
    buildScene(stageId, state) { return { scene: 'custom', devices: [] }; }
    getEnergyMonitor(state) { return { consumption: 'N/A', savings: 'N/A' }; }
}
window.IoTLayer = IoTLayer;

const express = require('express');
const ModbusRTU = require('modbus-serial');
const path = require('path');

const app = express();
const PORT = 3000;

// pkg 打包後 __dirname 指向 snapshot 虛擬路徑，靜態資源需從該路徑讀取
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/api/read', async (req, res) => {
    const ip = req.query.ip;
    const port = parseInt(req.query.port) || 502;
    const unitId = parseInt(req.query.unitId) || 1;
    const fc = parseInt(req.query.fc) || 3;
    const address = parseInt(req.query.address) || 0;
    const length = parseInt(req.query.length) || 1;

    if (!ip) {
        return res.status(400).json({ error: '缺少 IP 參數' });
    }
    if (fc < 1 || fc > 4) {
        return res.status(400).json({ error: 'Function Code 必須為 1-4' });
    }
    if (length < 1 || length > 125) {
        return res.status(400).json({ error: 'Length 必須為 1-125' });
    }

    const client = new ModbusRTU();
    client.setTimeout(3000);

    try {
        await client.connectTCP(ip, { port: port });
        client.setID(unitId);

        let result;
        switch (fc) {
            case 1:
                result = await client.readCoils(address, length);
                res.json({
                    type: 'bits',
                    bits: result.data.slice(0, length)
                });
                break;
            case 2:
                result = await client.readDiscreteInputs(address, length);
                res.json({
                    type: 'bits',
                    bits: result.data.slice(0, length)
                });
                break;
            case 3:
                result = await client.readHoldingRegisters(address, length);
                res.json({
                    type: 'registers',
                    registers: Array.from(result.data),
                    rawBytes: Array.from(result.buffer)
                });
                break;
            case 4:
                result = await client.readInputRegisters(address, length);
                res.json({
                    type: 'registers',
                    registers: Array.from(result.data),
                    rawBytes: Array.from(result.buffer)
                });
                break;
        }
    } catch (err) {
        res.status(500).json({ error: err.message || '連線或讀取失敗' });
    } finally {
        try {
            client.close();
        } catch (e) {
            // ignore close errors
        }
    }
});

app.listen(PORT, () => {
    console.log(`Modbus TCP 檢視工具已啟動: http://localhost:${PORT}`);
});

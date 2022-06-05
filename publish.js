const mqtt = require('mqtt');
const pako = require('pako');
const Axios = require('axios');
const axios = Axios.create();
// 请求静态数据的url
const getStaticInfoUrl = "http://101.6.143.8:65515/sim/staticinfo/";

// mqtt的相关信息
const mqttUrl = 'ws://39.107.153.245:36002/mqtt';
const mqttOptions = {
  username: "mnfz",
  password: "mnfz000"
}
const idx = '3';

const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
};

const publish = async () => {
    const result = await axios.get(`${getStaticInfoUrl}?scenarioIdx=${idx}`);
    const staticInfo = result.data.data;
    const streetEdges = staticInfo.edges.filter(item => item.type === 'street');
    let i = 0;
    const client = mqtt.connect(mqttUrl, mqttOptions);
    while (true) {
        const data = { veh: [], people: [] };
        data.veh = streetEdges.map(item => ({
            id: item.id,
            currentStreet: item.id,
            currentSide: 'a',
            type: 'car',
            pos: item.points[i % item.points.length],
        }))
        client.publish('ryh_test_' + idx, pako.deflate(JSON.stringify(data)));
        i++;
        await sleep(30);
    }
}

publish();
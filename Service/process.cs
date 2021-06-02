using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;
using USV.Hubs;
using USV.Model;


namespace USV.Service
{
    public class process
    {
        private readonly IHubContext<ChatHub> _chatHub;
        public process(IHubContext<ChatHub> ChatHub)
        {
            _chatHub=ChatHub;
            Connect();
        }
        public void Connect()
        {
            string BrokerAddress = "maqiatto.com";

           MqttClient mqttClient = new MqttClient(BrokerAddress);
            //mqttClient = new MqttClient("maqiatto.com", 8883, false, null, null, MqttSslProtocols.QOS_LEVEL_EXACTLY_ONCE);
            mqttClient.Connect(Guid.NewGuid().ToString(), "nguyenhoangminhdungbk18@gmail.com", "020920ka");
            mqttClient.MqttMsgPublishReceived += client_MqttMsgPublishReceived;
            mqttClient.Subscribe(new string[] { "nguyenhoangminhdungbk18@gmail.com/USV" }, new byte[] { MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE });
        }
        void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            //Deserialize MQTT Message
            string jsonString = Encoding.UTF8.GetString(e.Message);
            //Decode message into sensor data
            try
            {
                Message Message = JsonConvert.DeserializeObject<Message>(jsonString);
                string odomFrame = JsonConvert.SerializeObject(Message.Odom);
                string Sensor = JsonConvert.SerializeObject(Message.Sensor);
              //  string Error = JsonConvert.SerializeObject(Message.Error);
                string Setpoint = JsonConvert.SerializeObject(Message.Setpoint);
                _chatHub.Clients.All.SendAsync("ReceiveMessage", odomFrame,Setpoint,Sensor);
            }
            catch 
            { }            
        }


    }
}

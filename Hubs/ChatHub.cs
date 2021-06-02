using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using USV.Model;
using USV.Service;

namespace USV.Hubs
{
    public class ChatHub : Hub
    {
        static process _process;
        public ChatHub(process process)
        {
            _process = process;
        }
        
        public async Task SendMessage(string odomFrame, string setpoint, string error, string sonarFrame )
        {
            await Clients.All.SendAsync("ReceiveMessage", odomFrame,setpoint, error, sonarFrame);
        }
    }
}

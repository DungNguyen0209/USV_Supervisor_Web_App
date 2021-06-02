using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace USV.Model
{
    
    public class Message
    {
        public Odom Odom { get; set; }
        public Setpoint Setpoint { get; set; }
        public Thruster Thruster { get; set; }
       //public Error Error { get; set; }
        public Sensor Sensor { get; set; }

    }
    public class Odom
    {
        public float latitude { get; set; }
        public float longitude { get; set; }
        public float altitude { get; set; }
        public float position_x { get; set; }
        public float position_y { get; set; }
        public float position_z { get; set; }
        public float linear_velocity_x { get; set; }
        public float linear_velocity_y { get; set; }
        public float linear_velocity_z { get; set; }
        public float orientation_x { get; set; }
        public float orientation_y { get; set; }
        public float orientation_z { get; set; }

    }
    public class Setpoint
    {
        public float linear_velocity_x { get; set; }
        public float linear_velocity_y { get; set; }
        public float linear_velocity_z { get; set; }
        public float orientation_x { get; set; }
        public float orientation_y { get; set; }
        public float orientation_z { get; set; }

    }
    public class Thruster
    {
        public float rear_pwm { get; set; }
        public float rear_force { get; set; }
        public float side_pwm { get; set; }
        public float side_force { get; set; }

    }
    public class Error
    {
        public float along_track { get; set; }
        public float cross_track { get; set; }

    }
    public class Sensor
    {
        public float distance_left { get; set; }
        public float distance_right { get; set; }
        public float temperature { get; set; }
    }
}


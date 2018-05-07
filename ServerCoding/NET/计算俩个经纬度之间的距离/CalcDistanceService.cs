using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service
{
    public class CalcDistanceService
    {
        private const double EARTH_RADIUS = 6378137.0;//地球赤道半径

        /// <summary>  
        /// 计算两个经纬度之间的直接距离
        /// </summary>  
        public static double GetDistance(Degree Degree1, Degree Degree2)
        {
            double radLat1 = radians(Degree1.Y);
            double radLng1 = radians(Degree1.X);
            double radLat2 = radians(Degree2.Y);
            double radLng2 = radians(Degree2.X);

            double s = Math.Acos(Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Cos(radLng1 - radLng2) + Math.Sin(radLat1) * Math.Sin(radLat2));
            s = s * EARTH_RADIUS;
            s = Math.Round(s * 10000) / 10000;
            return s;
        }

        /// <summary>  
        /// 以一个经纬度为中心计算出四个顶点  
        /// </summary>  
        /// <param name="Degree1">中心点</param>  
        /// <param name="distance">半径(米)</param>  
        /// <returns></returns>  
        public static Degree[] GetDegreeCoordinates(Degree Degree1, double distance)
        {
            // const double EARTH_RADIUS = 6378137.0;//地球赤道半径(单位：m。6378137m是1980年的标准，比1975年的标准6378140少3m）  
            double dlng = 2 * Math.Asin(Math.Sin(distance / (2 * EARTH_RADIUS)) / Math.Cos(Degree1.X));
            dlng = degrees(dlng);//一定转换成角度数  

            double dlat = distance / EARTH_RADIUS;
            dlat = degrees(dlat);//一定转换成角度数  

            return new Degree[] { new Degree(Math.Round(Degree1.X - dlng,6), Math.Round(Degree1.Y + dlat,6)),//left-top  
                                   new Degree(Math.Round(Degree1.X - dlng,6), Math.Round(Degree1.Y - dlat,6)),//left-bottom  
                                   new Degree(Math.Round(Degree1.X + dlng,6), Math.Round(Degree1.Y + dlat,6)),//right-top  
                                   new Degree(Math.Round(Degree1.X + dlng,6), Math.Round(Degree1.Y - dlat,6)) //right-bottom  
            };
        }


        public static PositionModel FindNeighPosition(double longitude, double latitude, double distance)
        {
            //先计算查询点的经纬度范围  
            double r = 6378.137;//地球半径千米  
            double dis = distance;//千米距离    
            double dlng = 2 * Math.Asin(Math.Sin(dis / (2 * r)) / Math.Cos(latitude * Math.PI / 180));
            dlng = dlng * 180 / Math.PI;//角度转为弧度  
            double dlat = dis / r;
            dlat = dlat * 180 / Math.PI;
            double minlat = latitude - dlat;
            double maxlat = latitude + dlat;
            double minlng = longitude - dlng;
            double maxlng = longitude + dlng;
            return new PositionModel
            {
                MinLat = minlat,
                MaxLat = maxlat,
                MinLng = minlng,
                MaxLng = maxlng
            };
        }




        /// <summary>  
        /// 角度数转换为弧度公式  
        /// </summary>  
        /// <param name="d"></param>  
        /// <returns></returns>  
        private static double radians(double d)
        {
            return d * Math.PI / 180.0;
        }

        /// <summary>  
        /// 弧度转换为角度数公式  
        /// </summary>  
        /// <param name="d"></param>  
        /// <returns></returns>  
        private static double degrees(double d)
        {
            return d * (180 / Math.PI);
        }
    }
	
	public class Degree
    {
        public Degree(double x, double y)
        {
            X = x;
            Y = y;
        }
        /// <summary>  
        /// 经度  
        /// </summary>  
        private double x;
        /// <summary>  
        /// 经度  
        /// </summary>  
        public double X
        {
            get { return x; }
            set { x = value; }
        }
        /// <summary>  
        /// 纬度  
        /// </summary>  
        private double y;
        /// <summary>  
        /// 纬度  
        /// </summary>  
        public double Y
        {
            get { return y; }
            set { y = value; }
        }
    }
	
	public class PositionModel
    {
        public double MinLat { get; set; }
        public double MaxLat { get; set; }
        public double MinLng { get; set; }
        public double MaxLng { get; set; }
    }
}
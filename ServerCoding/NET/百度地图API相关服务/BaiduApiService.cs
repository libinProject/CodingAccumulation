using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service
{
    public class BaiduApiService
    {
        private static string AK = "key";

        /// <summary>
        /// 获取当前地址（gps经纬度）
        /// </summary>
        /// <param name="longitude">经度</param>
        /// <param name="latitude">纬度</param>
        /// <returns></returns>
        public static string Path(string longitude, string latitude)
        {
            try
            {
                //微信经纬度转换成百度经纬度
                string json = Geoconv(longitude, latitude);
                JObject jo = JObject.Parse(json);
                if (jo != null && jo["status"].ToString() == "0")
                {
                    JArray ja = JArray.Parse(jo["result"].ToString());

                    string baidulatitude = ja[0]["x"].ToString();
                    string baidulongitude = ja[0]["y"].ToString();
                    //获取地址
                    string results = Geocoder(baidulongitude, baidulatitude);
                    //Loger.Exp(results);
                    results = results.Substring(0, results.Length - 1).Replace("renderReverse&&renderReverse(", "");
                    //string results = Regex.Match(path, @"(?is)(?<=\()[^\)]+(?=\))").ToString();
                    JObject jopath = JObject.Parse(results);
                    if (jopath != null && jopath["status"].ToString() == "0")
                    {
                        //return jopath["result"]["formatted_address"].ToString();
                        return jopath["result"]["addressComponent"]["city"].ToString();
                    }
                }
                return "";
            }
            catch (Exception ex)
            {
                Logger.Info("baiduapiPath:" + ex.ToString() + "");
                return "";
            }
        }

        /// <summary>
        /// 微信经纬度转换成百度经纬度
        /// </summary>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        /// <returns></returns>
        public static string Geoconv(string longitude, string latitude)
        {
            string url = "https://api.map.baidu.com/geoconv/v1/?coords=" + longitude + "," + latitude + "&from=1&to=5&ak=" + AK + "";

            string json = WebClientHelper.Instance.Get(url);
            return json;
        }

        /// <summary>
        /// 通过百度坐标获取地理位置
        /// </summary>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <returns></returns>
        public static string Geocoder(string longitude, string latitude)
        {
            string url = "https://api.map.baidu.com/geocoder/v2/?ak=" + AK + "&callback=renderReverse&location=" + longitude + "," + latitude + "&output=json&pois=1";

            string json = WebClientHelper.Instance.Get(url);
            return json;
        }

        /// <summary>
        /// 根据百度经纬度获取地址
        /// </summary>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <returns></returns>
        public static string GetBaiduPath(string longitude, string latitude)
        {
            try
            {
                //获取地址
                string results = GeocoderNew(longitude, latitude);
                results = results.Substring(0, results.Length - 1).Replace("renderReverse&&renderReverse(", "");
                //string results = Regex.Match(path, @"(?is)(?<=\()[^\)]+(?=\))").ToString();
                JObject jopath = JObject.Parse(results);
                if (jopath != null && jopath["status"].ToString() == "0")
                {
                    return jopath["result"]["formatted_address"].ToString();
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                Logger.Info("baiduapiPath:" + ex.ToString() + "");
                return "";
            }
        }
        /// <summary>
        /// 百度经纬度取地址
        /// </summary>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <returns></returns>
        public static string GeocoderNew(string longitude, string latitude)
        {
            string url = "https://api.map.baidu.com/geocoder/v2/?ak=" + AK + "&callback=renderReverse&location=" + latitude + "," + longitude + "&output=json&pois=1";

            string json = WebClientHelper.Instance.Get(url);
            return json;
        }
    }
}
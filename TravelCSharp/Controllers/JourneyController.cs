using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using TravelCSharp.Models.Dto;
using System.Collections.Generic;

namespace TravelCSharp.Controllers
{
    public class JourneyController : Controller
    {

        [HttpGet]
        public ActionResult GetJourney(JourneySearchDto searchParam)
        {
            var data = Newtonsoft.Json.JsonConvert.DeserializeObject<List<JourneyDto>>(System.IO.File.ReadAllText(Server.MapPath("~/Content/data/journey.json")));

            if (searchParam.StartDate != null && searchParam.EndDate != null)
            {
                data = data.Where(d => d.StartDate >= searchParam.StartDate && d.EndDate <= searchParam.EndDate).ToList();
            }

            if (!string.IsNullOrWhiteSpace(searchParam.SearchText))
            {
                data = data.Where(d => d.StartTown.Contains(searchParam.SearchText) || d.StartStreet.Contains(searchParam.SearchText) ||
                d.EndTown.Contains(searchParam.SearchText) || d.EndStreet.Contains(searchParam.SearchText)).ToList();
            }
            var totalRecords = data.Count();

            data = data.Skip(searchParam.PageNumber).Take(searchParam.PageSize).ToList();

            var result = new TravelCSharp.Common.Paging<JourneyDto>()
            {
                PageNumber = searchParam.PageNumber,
                PageSize = searchParam.PageSize,
                Records = data,
                TotalRecords = totalRecords
            };

            return this.Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelCSharp.Models.Dto
{
    public class JourneySearchDto
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string SearchText { get; set; }
    }
}
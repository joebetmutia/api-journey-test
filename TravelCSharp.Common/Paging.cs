using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelCSharp.Common
{
    public class Paging<T> where T : class
    {
        /// <summary>
        /// Total records
        /// </summary>
        public int TotalRecords { get; set; }
        /// <summary>
        /// Page number
        /// </summary>
        public int PageNumber { get; set; }
        /// <summary>
        /// Page size (min 1, max 100)
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// Records
        /// </summary>
        public List<T> Records { get; set; }
        /// <summary>
        /// Meta
        /// </summary>
        public Dictionary<string, object> Meta { get; set; }
    }
}

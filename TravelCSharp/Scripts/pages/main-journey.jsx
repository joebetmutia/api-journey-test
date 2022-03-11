// /Scripts/HelloWorld.jsx
class MainJourneyComponent extends React.Component {

    componentDidMount() {
        

        this.state = {
            authResult: '',
            startDate: '03/01/2022 12:00 AM',
            endDate: '03/31/2022 11:59 PM'
        }

        this.initDataTable()
        this.initControls();

        this.displayAuthResult = this.displayAuthResult.bind(this)
    }

    initControls() {
        var self = this;
        $('input[name="datetimes"]').daterangepicker({
            timePicker: true,
            startDate: '03/01/2022 12:00 AM',
            endDate: '03/31/2022 11:59 PM',
            showDropdowns: true,
            locale: {
                format: 'MM-DD-YYYY hh:mm A'
            }
        });

        $('input[name="datetimes"]').on('apply.daterangepicker', function (ev, picker) {
            console.log(picker.startDate.format('MM-DD-YYYY hh:mm A'));
            console.log(picker.endDate.format('MM-DD-YYYY hh:mm A'));
            self.setState({
                startDate: picker.startDate.format('MM-DD-YYYY hh:mm A'),
                endDate: picker.endDate.format('MM-DD-YYYY hh:mm A'),
            })

            self.state.userDataTable.ajax.reload();

            $(this).val(picker.startDate.format('MM-DD-YYYY hh:mm A') + ' - ' + picker.endDate.format('MM-DD-YYYY hh:mm A'));
        });
    }

    initDataTable() {
        var self = this;
        var userDataTablle = $('.user-data-table').DataTable({
            "processing": true,
            "pageLength": 10,
            "serverSide": true,
            "order": [],
            'dom': 'Bfrtip',
            'buttons': [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            "ajax": {
                "url": '/Journey/GetJourney',
                "data": function (d) {

                    var options = {
                        searchText: d.search.value,
                        pageSize: d.length,
                        pageNumber: d.start / d.length + 1,
                    };

                    console.log('datatable options', d);
                    console.log('our options', options);

                    d.searchText = options


                    console.log('self.state', self.state)

                    return $.extend({}, d, {
                        SearchText: d.search.value,
                        PageSize: d.length,
                        PageNumber: d.start / d.length + 1,
                        StartDate: self.state?.startDate,
                        EndDate: self.state?.endDate,
                    });

                },
                "dataSrc": function (json) {
                    //console.log('dtaaaa', json)
                    json.recordsTotal = json.TotalRecords;
                    json.recordsFiltered = json.TotalRecords;
                    return json.Records
                },
                error: function (jqXHR, exception) {
                    console.log(jqXHR)
                    console.log(exception)
                }
            },
            fnDrawCallback: function () {
                //self.initBindings();
            },
            "columns": [

                {
                    data: null, render: function (data, type, row) {
                        //console.log(data)
                        return moment(data.StartDate).format('MMMM Do YYYY, h:mm:ss a');
                    }
                },

                { "data": "StartStreet" },
                { "data": "StartTown" },

                {
                    data: null, render: function (data, type, row) {
                        return moment(data.EndDate).format('MMMM Do YYYY, h:mm:ss a');
                    }
                },

                { "data": "EndStreet" },
                { "data": "EndTown" },

                { "data": "Distance" },
                { "data": "Duration" },
            ]
        });
        self.setState({ userDataTable: userDataTablle })

        $('.dataTables_filter input', userDataTablle.table().container())
            .off('.DT')
            .on('keyup.DT cut.DT paste.DT input.DT search.DT', function (e) {
                // If the length is 3 or more characters, or the user pressed ENTER, search
                if (this.value.length >= 3 || e.keyCode == 13) {
                    // Call the API search function
                    userDataTablle.search(this.value).draw();
                }

                // Ensure we clear the search if they backspace far enough
                if (this.value === "") {
                    userDataTablle.search("").draw();
                }
            });




    }

    doSampleAuth() {
        var self = this;
        var data = JSON.stringify({ "client_id": "0", "grant_type": "password", "username": "devtest@matrixtelematics.com", "password": "Techtest18" });

        var config = {
            method: 'post',
            url: 'https://apiuat.matrixtelematics.com/OAuth/token',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                self.setState({
                    authResult: JSON.stringify(response.data)
                })
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });


    }

    displayAuthResult() {
        var self = this;
        if (self.state != null && self.state.authResult != '') {
            return (
                <React.Fragment>
                    <pre><code>{self.state.authResult}</code></pre>
                </React.Fragment>
            )
        }
    }

    render() {
        var self = this;
        return (
            <React.Fragment>

                <p className="p-t-100"><button type="button" className="btn btn-primary" onClick={(e) => self.doSampleAuth()}>Task 1: Sample Auth Call</button></p>
                {
                    self.displayAuthResult()
                }
                <hr />
                <div className="p-t-100">
                    <pre ><code>Task - 2: Please note that since the Get API returns an emtpy array. The below records are not comming from matrixtelematics.com but at the internal Api which query a json. </code></pre>
                </div>
                <div className="row">

                    <div className="col-md-12">
                        <label>Date Time Filter</label>    <input type="text" name="datetimes" value="03/01/2022 12:00 AM - 3/31/2022 11:59 PM" />
                    </div>
                </div>
                <div className="table-responsive ">
                    <table id="" className="table table-striped table-bordered  user-data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>Start Street</th>
                                <th>Start Town</th>
                                <th>End Date</th>
                                <th>End Street</th>
                                <th>End Town</th>
                                <th>Distance</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}
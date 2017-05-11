$(function() {
    $('#mice').DataTable( {
        "ajax": {
            "url": "/getMice",
            "type": "POST"
            },
        "columns":[
            {"data": "id"},
            {"data": "genotype_id"},
            {"data": "dob"},
            {"data": "sex_id"},
            {"data": "ear_tag"},
            {"data": "status_id"},
            {"data": "notes"},
            {"data": "create_timestamp"},
            {"data": "modify_timestamp"},
            {"data": "soft_delete"}
        ]


    } );
}

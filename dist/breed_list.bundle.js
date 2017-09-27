webpackJsonp([7], { 230: function(e, t, a) { "use strict"; var _ = a(4);
        $(function() { var e = ["id", "id_alias", "genotype", "male_mouse", "female_mouse", "pairing_date", "plug_date", "litter_date", "end_date", "pup_check_date", "male_count", "female_count", "notes"],
                t = (0, _.setup_table)({ model_name: "breed", column_names: e, hide_id_column: !0 });
            (0, _.setup_list_page_buttons)("breed", t) }) } }, [230]);
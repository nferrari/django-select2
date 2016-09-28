(function ($) {

    var init = function ($element, options) {
        $element.select2(options);
    };

    var initHeavy = function ($element, options) {
        var settings = $.extend({
            ajax: {
                data: function (params) {
                    return {
                        term: params.term,
                        page: params.page,
                        field_id: $element.data('field_id')
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.more
                        }
                    };
                }
            }
        }, options);
        $element.select2(settings);
    };

    $.fn.djangoSelect2 = function (options) {
        var settings = $.extend({}, options);
        $.each(this, function (i, element) {
            var $element = $(element);
            if ($element.hasClass('django-select2-heavy')) {
                initHeavy($element, settings);
                $selected_option = $element.find(':selected');
                if ($selected_option.val() & !$selected_option.text()) {
                    $.ajax({
                        type: $element.data('ajax--type'),
                        url: $element.data('ajax--url') + $selected_option.val(),
                        dataType: 'json'
                    }).then(function (data) {
                        $selected_option.text(data.text);
                        $selected_option.removeData();
                        $element.trigger('change');
                    });
                }
            } else {
                init($element, settings);
            }
        });
        return this;
    };

    $(function () {
        $('.django-select2').not('.empty-form .django-select2').djangoSelect2();
    });

    django.jQuery(document).on('formset:added', function(event, $row, formsetName) {
        $($row).find('.django-select2').djangoSelect2();
    });

}(this.jQuery));

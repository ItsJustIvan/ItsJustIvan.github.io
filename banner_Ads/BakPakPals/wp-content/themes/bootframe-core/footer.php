<footer class="smartlib-footer-area ">
    <!--Footer sidebar-->

                <?php do_action('smartlib_footer_sidebar', 'default'); ?>

    <!--END Footer sidebar-->
    <!--Footer bottom - customizer-->
    <section class="smartlib-content-section smartlib-bottom-footer">
        <div class="container">

            <div class="row">

                <div class="col-lg-4">
                </div>
                <div class="col-lg-4">
                    <?php do_action('smartlib_social_links', 'footer') ?>
                </div>
	       <div class="col-lg-4">
     		<p><?php smartlib_get_section_info_text('footer'); ?></p>
		Contact us: <a href="mailto:Info@bakpakpals.com">Info@bakpakpals.com</a><br>
		Designed by <a href="http://www.focuspdm.com/">Focus PDM</a>
               </div>
            </div>
        </div>
    </section>
    <!--END Footer bottom - customizer-->
</footer>

<?php
do_action('smartlib_after_content');
wp_footer();

?>

</body>
</html>
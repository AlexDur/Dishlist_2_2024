package com.rezepte_app.handler;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;

/**
 * Cognito has a custom logout url.
 * See more information <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html">here</a>.
 */
@Component // Damit Spring die Klasse als Bean verwaltet
public class CognitoLogoutHandler extends SimpleUrlLogoutSuccessHandler {

    /**
     * The domain of your user pool.
     */
    private String domain = "https://eu-central-1yr2fphvf2.auth.eu-central-1.amazoncognito.com";

    /**
     * An allowed callback URL.
     */
    private String logoutRedirectUrl = "https://www.dish-list.de/logout";

    /**
     * The ID of your User Pool Client.
     */
    private String userPoolClientId = "15hnq9gpulkh08a9k0epcmhsj3";

    /**
     * Here, we must implement the new logout URL request. We define what URL to send our request to, and set out client_id and logout_uri parameters.
     */
    @Override
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        return UriComponentsBuilder
                .fromUri(URI.create(domain + "/logout"))
                .queryParam("client_id", userPoolClientId)
                .queryParam("logout_uri", logoutRedirectUrl)
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();
    }
}
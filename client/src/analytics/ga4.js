/**
 * InsightHub — Google Analytics 4 Event Tracking
 */

const GA4_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID;

export const initGA4 = () => {
    if (!GA4_ID || GA4_ID === 'G-XXXXXXXXXX') {
        console.warn('⚠️ GA4: No valid Measurement ID — tracking disabled');
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, {
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false,
    });

    console.log('✅ GA4 initialised:', GA4_ID);
};

export const trackPageView = (path, title) => {
    if (!window.gtag) return;
    window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.href,
    });
};

export const trackEvent = (eventName, parameters = {}) => {
    if (!window.gtag) return;
    window.gtag('event', eventName, {
        ...parameters,
        app_version: '1.0.0',
    });
};

export const trackUserRegistered = (plan = 'free') => {
    trackEvent('sign_up', { method: 'email', plan });
};

export const trackUserLoggedIn = () => {
    trackEvent('login', { method: 'email' });
};

export const trackUserLoggedOut = () => {
    trackEvent('user_logged_out');
};

export const trackDataFetched = (dataType, fromCache) => {
    trackEvent('data_fetched', {
        data_type: dataType,
        source: fromCache ? 'cache' : 'api',
    });
};

export const trackWidgetRefreshed = (widgetName) => {
    trackEvent('widget_refreshed', { widget_name: widgetName });
};

export const trackFilterChanged = (filterType, filterValue) => {
    trackEvent('filter_applied', {
        filter_type: filterType,
        filter_value: filterValue,
    });
};

export const trackNewsArticleClicked = (title, source) => {
    trackEvent('news_article_clicked', {
        article_title: title.substring(0, 100),
        article_source: source,
    });
};

export const trackFeatureUsed = (featureName, action = 'used') => {
    trackEvent('feature_used', {
        feature_name: featureName,
        action,
    });
};

export const trackError = (errorType, message) => {
    trackEvent('app_error', {
        error_type: errorType,
        error_message: message.substring(0, 150),
    });
};
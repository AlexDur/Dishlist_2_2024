module com.example.backend {
    requires javafx.controls;
    requires javafx.fxml;
            
                            
    opens com.example.backend to javafx.fxml;
    exports com.example.backend;
}
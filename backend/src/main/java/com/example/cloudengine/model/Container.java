package com.example.cloudengine.model;

public class Container {
    private String id;
    private String name;
    private String image;
    private int port;
    private int cpu;
    private int ram;
    private String status; // running, stopped, restarting
    private String created;

    public Container() {}

    public Container(String id, String name, String image, int port, int cpu, int ram, String status, String created) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.port = port;
        this.cpu = cpu;
        this.ram = ram;
        this.status = status;
        this.created = created;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }

    public int getCpu() { return cpu; }
    public void setCpu(int cpu) { this.cpu = cpu; }

    public int getRam() { return ram; }
    public void setRam(int ram) { this.ram = ram; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreated() { return created; }
    public void setCreated(String created) { this.created = created; }
}

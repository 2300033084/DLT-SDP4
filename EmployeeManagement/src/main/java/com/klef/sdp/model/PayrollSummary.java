package com.klef.sdp.model;

public class PayrollSummary {

    private String month;
    private int presentDays;
    private int leaveDays;
    private int absentDays;
    private double dailyWage;
    private double basicSalary;
    private double totalDeductions;
    private double netSalary;

    public PayrollSummary() {
    }

    public PayrollSummary(String month, int presentDays, int leaveDays, int absentDays, double dailyWage, double basicSalary, double totalDeductions, double netSalary) {
        this.month = month;
        this.presentDays = presentDays;
        this.leaveDays = leaveDays;
        this.absentDays = absentDays;
        this.dailyWage = dailyWage;
        this.basicSalary = basicSalary;
        this.totalDeductions = totalDeductions;
        this.netSalary = netSalary;
    }

    // Getters and Setters

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(int presentDays) {
        this.presentDays = presentDays;
    }

    public int getLeaveDays() {
        return leaveDays;
    }

    public void setLeaveDays(int leaveDays) {
        this.leaveDays = leaveDays;
    }

    public int getAbsentDays() {
        return absentDays;
    }

    public void setAbsentDays(int absentDays) {
        this.absentDays = absentDays;
    }

    public double getDailyWage() {
        return dailyWage;
    }

    public void setDailyWage(double dailyWage) {
        this.dailyWage = dailyWage;
    }

    public double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public double getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(double totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public double getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(double netSalary) {
        this.netSalary = netSalary;
    }
}

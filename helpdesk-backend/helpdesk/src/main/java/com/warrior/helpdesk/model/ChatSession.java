package com.warrior.helpdesk.model;

import com.warrior.helpdesk.enums.ConversationStage;

public class ChatSession {

    private ConversationStage stage = ConversationStage.GREETING;
    private String problemSummary;

    public ConversationStage getStage() {
        return stage;
    }

    public void setStage(ConversationStage stage) {
        this.stage = stage;
    }

    public String getProblemSummary() {
        return problemSummary;
    }

    public void setProblemSummary(String problemSummary) {
        this.problemSummary = problemSummary;
    }
}

Feature: Task Management CRUD
  As a user
  I want to create, view, update, and delete tasks
  So that I can manage my to-do list

  Background:
    Given I am on the "My Tasks" page

  @create @crud
  Scenario: Create a task
    When I click the "New Task" button
    And I enter "Buy groceries" as the title
    And I press "Save"
    Then I should see "Buy groceries" in my task list

  @view @crud
  Scenario: View a task
    Given a task "Buy groceries" exists
    When I click on the task "Buy groceries"
    Then I should see the task detail page for "Buy groceries"

  @update @crud
  Scenario: Update a task
    Given a task "Buy groceries" exists
    When I press "Edit" on the task "Buy groceries"
    And I change the title to "Buy milk and eggs"
    And I press "Save"
    Then I should see "Buy milk and eggs" in my task list

  @delete @crud
  Scenario: Delete a task
    Given a task "Buy groceries" exists
    When I press "Delete" on the task "Buy groceries"
    And I confirm the deletion
    Then I should not see "Buy groceries" in my task list

using NUnit.Framework;
using RealEstate.Infrastructure;

namespace RealEstate.Test
{
    public class MongoSettingsTests
    {
        [Test]
        public void MongoSettings_DefaultValues_AreNull()
        {
            var settings = new MongoSettings();
            Assert.That(settings.ConnectionString, Is.Empty);
            Assert.That(settings.DatabaseName, Is.Empty);
        }

        [Test]
        public void MongoSettings_CanSetProperties()
        {
            var settings = new MongoSettings
            {
                ConnectionString = "mongodb://test:27017",
                DatabaseName = "TestDb"
            };
            Assert.That(settings.ConnectionString, Is.EqualTo("mongodb://test:27017"));
            Assert.That(settings.DatabaseName, Is.EqualTo("TestDb"));
        }
    }
}